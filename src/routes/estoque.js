// ====================================
// src/routes/estoque.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const EstoqueController = require('../controllers/estoque/estoqueController');
const TransferenciaController = require('../controllers/estoque/transferenciaController');
const EncomendaController = require('../controllers/estoque/encomendaController');

router.use(authMiddleware);

// Instanciar controladores
const estoqueController = new EstoqueController();
const transferenciaController = new TransferenciaController();
const encomendaController = new EncomendaController();

// Rotas principais de estoque
router.get('/resumo', estoqueController.resumo);
router.get('/movimentacoes', estoqueController.movimentacoes);
router.get('/inventario', estoqueController.inventario);

// Rotas de transferências
router.get('/transferencias', transferenciaController.index);
router.get('/transferencias/create', transferenciaController.create);
router.post('/transferencias', transferenciaController.store);
router.get('/transferencias/:id', transferenciaController.show);

// Rotas de encomendas
router.get('/encomendas', encomendaController.index);
router.get('/encomendas/create', encomendaController.create);
router.post('/encomendas', encomendaController.store);
router.get('/encomendas/:id', encomendaController.show);

// Rota para guias de remessa (mantida simples por enquanto)
router.get('/guias', (req, res) => {
  res.render('estoque/guias/index', {
    title: 'Guias de Remessa - SYNTRA ERP',
    layout: 'layouts/main'
  });
});

module.exports = router;