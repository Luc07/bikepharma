const pool = require('../db');

async function getUsuario(req, res) {
  const { id_usuario } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
  }

  try {
    const [result] = await pool.query(`
      SELECT * FROM redeph12_usuarios.users WHERE user_id = ? AND department_id IN (1098, 1055, 1)
    `, [id_usuario]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar o usuário.' });
  }
}

module.exports = {
  getUsuario,
};
