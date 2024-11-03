const express = require('express');
const router = express.Router();
const { registrarBicicleta, getBicicletas } = require('../controllers/bicicletasController');

router.post('/bicicletas', registrarBicicleta);

router.post('/bicicletas/lista', getBicicletas)

module.exports = router;
