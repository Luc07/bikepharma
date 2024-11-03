const express = require('express');
const router = express.Router();
const { getUsuario } = require('../controllers/usuariosController');

router.get('/usuario/:id_usuario', getUsuario);

module.exports = router;
