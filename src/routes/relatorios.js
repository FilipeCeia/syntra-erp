// ====================================
// src/routes/relatorios.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const RelatoriosController = require('../controllers/relatorios/relatorioController');

const relatoriosController = new RelatoriosController();

router.use(authMiddleware);

// Vendas por Período
router.get('/vendas-periodo', relatoriosController.vendasPorPeriodo);

// Vendas por Cliente
router.get('/vendas-cliente', relatoriosController.vendasPorCliente);

// Vendas por Artigo
router.get('/vendas-artigo', relatoriosController.vendasPorArtigo);

// Compras por Período
router.get('/compras-periodo', relatoriosController.comprasPorPeriodo);

// Posição de Estoque
router.get('/posicao-estoque', relatoriosController.posicaoEstoque);

// Fluxo de Caixa
router.get('/fluxo-caixa', relatoriosController.fluxoCaixa);

// Relatório de IVA
router.get('/relatorio-iva', relatoriosController.relatorioIva);



module.exports = router;