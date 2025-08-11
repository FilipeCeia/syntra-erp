// ====================================
// src/routes/financas.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Importar controladores
const FinancasController = require('../controllers/financas/financasController');
const ContasPagarController = require('../controllers/financas/contasPagarController');
const ContasReceberController = require('../controllers/financas/contasReceberController');
const NotaDebitoController = require('../controllers/financas/notaDebitoController');
const NotaCreditoController = require('../controllers/financas/notaCreditoController');
const CaixaController = require('../controllers/financas/caixaController');

router.use(authMiddleware);

// Instanciar controladores
const financasController = new FinancasController();
const contasPagarController = new ContasPagarController();
const contasReceberController = new ContasReceberController();
const notaDebitoController = new NotaDebitoController();
const notaCreditoController = new NotaCreditoController();
const caixaController = new CaixaController();

// Dashboard Financeiro
router.get('/dashboard', financasController.dashboard);

// Contas a Pagar
router.get('/contas-pagar', contasPagarController.index);
router.get('/contas-pagar/create', contasPagarController.create);
router.post('/contas-pagar', contasPagarController.store);
router.get('/contas-pagar/:id', contasPagarController.show);
router.get('/contas-pagar/:id/edit', contasPagarController.edit);
router.put('/contas-pagar/:id', contasPagarController.update);
router.post('/contas-pagar/:id/pagar', contasPagarController.pagar);

// Contas a Receber
router.get('/contas-receber', contasReceberController.index);
router.get('/contas-receber/create', contasReceberController.create);
router.post('/contas-receber', contasReceberController.store);
router.get('/contas-receber/:id', contasReceberController.show);
router.get('/contas-receber/:id/edit', contasReceberController.edit);
router.put('/contas-receber/:id', contasReceberController.update);
router.post('/contas-receber/:id/receber', contasReceberController.receber);

// Notas de Débito
router.get('/notas-debito', notaDebitoController.index);
router.get('/notas-debito/create', notaDebitoController.create);
router.post('/notas-debito', notaDebitoController.store);
router.get('/notas-debito/:id', notaDebitoController.show);
router.get('/notas-debito/:id/edit', notaDebitoController.edit);
router.put('/notas-debito/:id', notaDebitoController.update);

// Notas de Crédito
router.get('/notas-credito', notaCreditoController.index);
router.get('/notas-credito/create', notaCreditoController.create);
router.post('/notas-credito', notaCreditoController.store);
router.get('/notas-credito/:id', notaCreditoController.show);
router.get('/notas-credito/:id/edit', notaCreditoController.edit);
router.put('/notas-credito/:id', notaCreditoController.update);

// Gestão de Caixa
router.get('/caixa', caixaController.index);
router.get('/caixa/movimentos', caixaController.movimentos);
router.get('/caixa/abertura', caixaController.abertura);
router.post('/caixa/abertura', caixaController.storeAbertura);
router.get('/caixa/fechamento', caixaController.fechamento);
router.post('/caixa/fechamento', caixaController.storeFechamento);

// Fluxo de Caixa
router.get('/fluxo-caixa', financasController.fluxoCaixa);
router.get('/fluxo-caixa/projecao', financasController.projecaoFluxo);

// Reconciliação Bancária
router.get('/reconciliacao', financasController.reconciliacao);
router.post('/reconciliacao/processar', financasController.processarReconciliacao);

// Gestão de Bancos
router.get('/bancos', financasController.bancos);
router.get('/bancos/create', financasController.createBanco);
router.post('/bancos', financasController.storeBanco);
router.get('/bancos/:id/extratos', financasController.extratosBanco);

module.exports = router;