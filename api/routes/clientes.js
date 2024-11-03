const express = require('express');
const router = express.Router();
const { registrarCliente, pesquisarCliente } = require('../controllers/clientesController'); // Ajuste o caminho conforme necessário

router.post('/clientes', registrarCliente);

router.get('/clientes', pesquisarCliente);

module.exports = router;
