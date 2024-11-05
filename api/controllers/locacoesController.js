const pool = require('../db');

async function getResumoLocacoes(req, res) {
  const { department_id } = req.body;
  try {
    let totalQuery = ''
    let abertasQuery = ''
    let concluidasQuery = ''
    if (department_id != 1 && department_id != 33) {
      totalQuery = await pool
        .query(`
          SELECT SUM(valor_total) AS valorTotalConcluidas, id_filial
          FROM locacoes
          WHERE status = 'Finalizado' AND DATE(data_fim) = CURDATE() AND id_filial = ?
          GROUP BY id_filial
        `, [department_id]);

      abertasQuery = await pool
        .query(`
        SELECT COUNT(*) AS totalEmAberto, id_filial
        FROM locacoes
        WHERE status = 'Em Trânsito' AND id_filial = ?
        GROUP BY id_filial
      `, [department_id]);

      concluidasQuery = await pool
        .query(`
        SELECT COUNT(*) AS totalFinalizado, id_filial
        FROM locacoes
        WHERE (status = 'Finalizado' OR status = 'Cancelado') AND id_filial = ?
        GROUP BY id_filial
      `, [department_id]);
    } else {
      totalQuery = await pool
        .query(`
          SELECT SUM(valor_total) AS valorTotalConcluidas, id_filial
          FROM locacoes
          WHERE status = 'Finalizado' AND MONTH(data_fim) = MONTH(CURDATE())
          GROUP BY id_filial
        `, []);

      abertasQuery = await pool
        .query(`
        SELECT COUNT(*) AS totalEmAberto, id_filial
        FROM locacoes
        WHERE status = 'Em Trânsito'
        GROUP BY id_filial
      `, []);

      concluidasQuery = await pool
        .query(`
        SELECT COUNT(*) AS totalFinalizado, id_filial
        FROM locacoes
        WHERE (status = 'Finalizado' OR status = 'Cancelado')
        GROUP BY id_filial
      `, []);
    }

    const combinacao = totalQuery[0].map(total => {
      const aberta = abertasQuery[0].find(item => item.id_filial === total.id_filial) || { totalEmAberto: 0 };
      const concluida = concluidasQuery[0].find(item => item.id_filial === total.id_filial) || { totalFinalizado: 0 };

      return {
        id_filial: total.id_filial,
        valorTotalConcluidas: total.valorTotalConcluidas,
        totalEmAberto: aberta.totalEmAberto,
        totalFinalizado: concluida.totalFinalizado
      };
    });

    const allFiliais = new Set([
      ...totalQuery[0].map(item => item.id_filial),
      ...abertasQuery[0].map(item => item.id_filial),
      ...concluidasQuery[0].map(item => item.id_filial)
    ]);

    allFiliais.forEach(id_filial => {
      if (!combinacao.find(item => item.id_filial === id_filial)) {
        const aberta = abertasQuery[0].find(item => item.id_filial === id_filial) || { totalEmAberto: 0 };
        const concluida = concluidasQuery[0].find(item => item.id_filial === id_filial) || { totalFinalizado: 0 };

        combinacao.push({
          id_filial,
          valorTotalConcluidas: 0,
          totalEmAberto: aberta.totalEmAberto,
          totalFinalizado: concluida.totalFinalizado
        });
      }
    });
    res.json(combinacao);
  } catch (error) {
    console.error('Erro ao obter o resumo das locações:');
    res.status(500).json({ message: 'Erro ao obter o resumo das locações' });
  }
}

async function getTodasLocacoes(req, res) {
  const { department_id } = req.body;
  try {
    let [locacoes] = ``;

    if (department_id == 1 || department_id == 33) {
      locacoes = await pool.query(`
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
        ORDER BY loc.id_locacao ASC;
      `, []);
    } else {
      locacoes = await pool.query(`
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
    }
    res.json(locacoes[0]);
  } catch (error) {
    console.error('Erro ao obter todas as locações:');
    res.status(500).json({ message: 'Erro ao obter as locações.' });
  }
}

async function criarLocacao(req, res) {
  const { cliente, bicicleta_id, status, department_id, horas } = req.body;

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
    console.error('Erro ao criar a locação:');
    res.status(500).json({ message: 'Erro ao criar a locação.' });
  }
}

async function getLocacaoById(id) {
  try {
    const query = `
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
      WHERE loc.id_locacao = ?
      ORDER BY loc.id_locacao ASC`;
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
      if (diffMs < 0) {
        updatedValorTotal = locacaoAtual.preco * horas;
      } else {
        let qtdTarifasPagar = 0
        let hours = diffMs / 3_600_000;
        while (hours > 0.25) {
          qtdTarifasPagar += 1
          hours -= 1
        }
        const preco = parseFloat(locacaoAtual.preco);
        updatedValorTotal = (preco * qtdTarifasPagar) + (preco * horas);
      }

      query += `, data_fim = ?, valor_total = ?`;
      params.splice(1, 0, updatedDataFim, updatedValorTotal);
    }

    if (status === 'Cancelado') {
      const currentDate = new Date();
      query += `, data_fim = ?`;
      params.splice(1, 0, currentDate);
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
      data_fim: status === 'Finalizado' || status === 'Cancelado' ? new Date() : locacaoAtual.data_fim,
      valor_total: updatedValorTotal || locacaoAtual.valor_total,
    });
  } catch (error) {
    console.error('Erro ao atualizar o status da locação:');
    res.status(500).json({ message: 'Erro ao atualizar o status da locação.' });
  }
}


module.exports = {
  getResumoLocacoes,
  getTodasLocacoes,
  criarLocacao,
  atualizarStatusLocacao
};
