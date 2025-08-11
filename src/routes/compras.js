// ====================================
// src/routes/compras.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const CompraController = require('../controllers/compras/compraController');
const DespesaController = require('../controllers/compras/despesaController');

router.use(authMiddleware);

// Instanciar controladores
const compraController = new CompraController();
const despesaController = new DespesaController();

// Rotas principais de compras
router.get('/', compraController.index);
router.get('/dashboard', compraController.dashboard);
router.get('/relatorios', compraController.relatorios);

// Rotas para compras de mercadoria
router.get('/mercadoria', compraController.mercadoria);
router.get('/mercadoria/create', compraController.createMercadoria);
router.post('/mercadoria', compraController.storeMercadoria);

// Rotas para despesas
router.get('/despesas', despesaController.index);
router.get('/despesas/create', despesaController.create);
router.post('/despesas', despesaController.store);
router.post('/despesas/store-and-pay', despesaController.storeAndPay);
router.get('/despesas/:id', despesaController.show);

module.exports = router;