const pool = require('../db');

async function registrarBicicleta(req, res) {
  const bicicleta = req.body.novaBicicleta
  const { numero, modelo, preco, preco_hr, filial } = bicicleta;

  if (!numero || !modelo) {
    return res.status(400).json({ message: 'Modelo e numero da bicicleta são obrigatórios.' });
  }

  try {
    const [result] = await pool.query(`
      INSERT INTO bicicletas (id_bicicleta, id_filial, modelo, preco, preco_hr) VALUES (?, ?, ?, ?, ?)
    `, [numero, filial, modelo, preco, preco_hr]);

    res.status(201).json({
      id: numero,
      modelo,
      disponibilidade: true,
      data_registro: new Date()
    });
  } catch (error) {
    console.error('Erro ao registrar a bicicleta:');
    res.status(500).json({ message: 'Erro ao registrar a bicicleta.' });
  }
}

async function getBicicletas(req, res) {
  const { department_id } = req.body;

  try {
    let [result] = '';

    if(department_id == 1){
      [result] = await pool.query(`
        SELECT * FROM bicicletas 
      `, []);
    }else if(department_id == 1055 || department_id == 1098){
      [result] = await pool.query(`
        SELECT * FROM bicicletas WHERE id_filial = ?
      `, [department_id]);
    }

    if(result.length === 0){
      return res.status(404).json({ message: 'Nenhuma bicicleta encontrada.' });
    }

    res.json(result);
  } catch (error) {
    console.error('Erro ao registrar a bicicleta:', error);
    res.status(500).json({ message: 'Erro ao registrar a bicicleta.' });
  }
}


module.exports = {
  registrarBicicleta,
  getBicicletas
};
