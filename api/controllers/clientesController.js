const pool = require('../db'); 

async function registrarCliente(req, res) {
  const { nome, cpf, telefone, endereco } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ message: 'Nome e CPF são obrigatórios.' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO clientes (nome, cpf, telefone, endereco) VALUES (?, ?, ?, ?)
    `, [nome, cpf, telefone, endereco]);

    res.status(201).json({
      id: result.insertId,
      nome,
      cpf,
      telefone,
      endereco,
      data_registro: new Date()
    });
  } catch (error) {
    console.error('Erro ao registrar o cliente:', error);
    res.status(500).json({ message: 'Erro ao registrar o cliente.' });
  }
}

async function pesquisarCliente(req, res) {

  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ message: 'CPF ou Nome são obrigatórios para a pesquisa.' });
  }

  try {
    const [clientes] = await pool.query(`
      SELECT * FROM clientes
      WHERE cpf = ? OR nome = ?
    `, [search, `${search}`]);

    if (clientes.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }

    res.json(clientes);
  } catch (error) {
    console.error('Erro ao pesquisar o cliente:', error);
    res.status(500).json({ message: 'Erro ao pesquisar o cliente.' });
  }
}

module.exports = {
  registrarCliente,
  pesquisarCliente
};