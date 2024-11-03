const express = require('express');
const router = express.Router();
const { getResumoLocacoes, getTodasLocacoes, criarLocacao, atualizarStatusLocacao } = require('../controllers/locacoesController');

router.get('/resumo', getResumoLocacoes);

router.post('/lista', getTodasLocacoes);

router.post('/', criarLocacao);

router.patch('/:id/status', atualizarStatusLocacao);

module.exports = router;
