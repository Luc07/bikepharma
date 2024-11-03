const pool = require('../db');

async function getResumoLocacoes(req, res) {
  try {

    const totalQuery = await pool
      .query(`
        SELECT SUM(valor) AS valorTotalConcluidas
        FROM locacoes
        WHERE status = 'Concluída' AND DATE(data_fim) = CURDATE()
      `);

    const valorTotalConcluidas = totalQuery[0].valorTotalConcluidas || 0;

    const abertasQuery = await pool
      .query(`
        SELECT COUNT(*) AS totalEmAberto
        FROM locacoes
        WHERE status = 'Pendente' OR status = 'Em Progresso'
      `);

    const totalEmAberto = abertasQuery[0].totalEmAberto || 0;

    res.json({
      valorTotalConcluidas,
      totalEmAberto
    });
  } catch (error) {
    console.error('Erro ao obter o resumo das locações:', error);
    res.status(500).json({ message: 'Erro ao obter o resumo das locações' });
  }
}

async function getTodasLocacoes(req, res) {
  const { department_id } = req.body;
  try {
    const [locacoes] = await pool.query(`
      SELECT 
      loc.id_locacao, 
      loc.id_bicicleta, 
      cli.*, 
      bic.preco_hr, 
      bic.preco, 
      loc.data_inicio, 
      loc.data_fim,
      loc.data_entrega,
      loc.data_cad, 
      loc.status, 
      loc.valor_total,
      loc.horas 
      FROM redeph12_bikepharma.locacoes loc
      INNER JOIN redeph12_bikepharma.bicicletas bic ON loc.id_bicicleta = bic.id_bicicleta AND loc.id_filial = bic.id_filial
      INNER JOIN redeph12_bikepharma.clientes cli ON loc.id_cliente = cli.id_cliente
      WHERE loc.id_filial = ?
      ORDER BY loc.id_locacao ASC;
    `, [department_id]);

    res.json(locacoes);
  } catch (error) {
    console.error('Erro ao obter todas as locações:', error);
    res.status(500).json({ message: 'Erro ao obter as locações.' });
  }
}

async function criarLocacao(req, res) {
  const { cliente, bicicleta_id, status, department_id, horas } = req.body;

  console.log(cliente)

  if (!cliente || !bicicleta_id) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
  }

  try {
    const dataCad = new Date();

    const [result] = await pool.query(`
      INSERT INTO locacoes (id_cliente, id_bicicleta, data_cad, status, id_filial, horas)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [cliente.id, bicicleta_id, dataCad, status, department_id, horas]);

    res.status(201).json({
      message: 'Locação criada com sucesso!',
      locacaoId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar a locação:', error);
    res.status(500).json({ message: 'Erro ao criar a locação.' });
  }
}

async function getLocacaoById(id) {
  try {
    const query = `SELECT 
      loc.id_locacao, 
      loc.id_bicicleta, 
      cli.*, 
      bic.preco_hr, 
      bic.preco, 
      loc.data_inicio, 
      loc.data_fim,
      loc.data_entrega,
      loc.data_cad, 
      loc.status, 
      loc.valor_total,
      loc.horas 
      FROM redeph12_bikepharma.locacoes loc
      INNER JOIN redeph12_bikepharma.bicicletas bic ON loc.id_bicicleta = bic.id_bicicleta AND loc.id_filial = bic.id_filial
      INNER JOIN redeph12_bikepharma.clientes cli ON loc.id_cliente = cli.id_cliente
      WHERE loc.id_locacao = ?
      ORDER BY loc.id_locacao ASC;`;
    const [rows] = await pool.query(query, [id]);
    
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Erro ao buscar a locação:', error);
    throw new Error('Erro ao buscar a locação.');
  }
}


async function atualizarStatusLocacao(req, res) {
  const { id } = req.params;
  const { status, horas } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status é obrigatório.' });
  }

  try {
    const locacaoAtual = await getLocacaoById(id);
    if (!locacaoAtual) {
      return res.status(404).json({ message: 'Locação não encontrada.' });
    }

    let query = `UPDATE locacoes SET status = ?`;
    const params = [status, id];
    let updatedValorTotal;

    if (status === 'Em Trânsito') {
      const currentDate = new Date();
      const updatedDataEntrega = new Date(currentDate.getTime() + horas * 60 * 60 * 1000);
      
      query += `, data_inicio = ?, data_entrega = ?`;
      params.splice(1, 0, currentDate, updatedDataEntrega);
    }

    if (status === 'Finalizado') {
      const updatedDataFim = new Date();
      const diffMs = updatedDataFim - locacaoAtual.data_entrega;
      if(locacaoAtual.status === 'Pendente'){
        updatedValorTotal = locacaoAtual.preco;
      }
      else if (diffMs < 0) {
        updatedValorTotal = locacaoAtual.preco;
      } else {
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const remainingMins = diffMins % 60;

        const preco = parseFloat(locacaoAtual.preco);
        const precoHr = parseFloat(locacaoAtual.preco_hr);

        updatedValorTotal = preco + (precoHr * diffHours) + (remainingMins > 15 ? precoHr : 0);
      }

      query += `, data_fim = ?, valor_total = ?`;
      params.splice(1, 0, updatedDataFim, updatedValorTotal);
    }

    query += ` WHERE id_locacao = ?`;

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Locação não encontrada.' });
    }

    res.json({
      message: 'Status da locação atualizado com sucesso!',
      id: locacaoAtual.id_locacao,
      status,
      data_inicio: status === 'Em Trânsito' ? new Date() : locacaoAtual.data_inicio,
      data_entrega: status === 'Em Trânsito' ? new Date(new Date().getTime() + horas * 60 * 60 * 1000) : locacaoAtual.data_entrega,
      data_fim: status === 'Finalizado' ? new Date() : locacaoAtual.data_fim,
      valor_total: updatedValorTotal || locacaoAtual.valor_total,
    });
  } catch (error) {
    console.error('Erro ao atualizar o status da locação:', error);
    res.status(500).json({ message: 'Erro ao atualizar o status da locação.' });
  }
}


module.exports = {
  getResumoLocacoes,
  getTodasLocacoes,
  criarLocacao,
  atualizarStatusLocacao
};
