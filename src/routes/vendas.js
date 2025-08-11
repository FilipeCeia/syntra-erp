// ====================================
// src/routes/vendas.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const VendaController = require('../controllers/vendas/vendaController');
const FacturaController = require('../controllers/vendas/facturaController');
const CotacaoController = require('../controllers/vendas/cotacaoController');

router.use(authMiddleware);

// Instanciar controladores
const vendaController = new VendaController();
const facturaController = new FacturaController();
const cotacaoController = new CotacaoController();

// Rotas principais de vendas
router.get('/', vendaController.index);
router.get('/dashboard', vendaController.dashboard);
router.get('/relatorios', vendaController.relatorios);
router.get('/factura-recibo', vendaController.facturaRecibo);
router.get('/vendas-credito', vendaController.vendasCredito);

// Rotas para facturas
router.get('/facturas', facturaController.index);
router.get('/facturas/create', facturaController.create);
router.post('/facturas', facturaController.store);
router.get('/facturas/:id', facturaController.show);
router.get('/facturas/:id/edit', facturaController.edit);
router.put('/facturas/:id', facturaController.update);
router.post('/facturas/:id/emitir', facturaController.emitir);
router.post('/facturas/:id/cancelar', facturaController.cancelar);
router.get('/facturas/:id/print', facturaController.imprimir);

// Rotas para cotações
router.get('/cotacoes', cotacaoController.index);
router.get('/cotacoes/create', cotacaoController.create);
router.post('/cotacoes', cotacaoController.store);
router.get('/cotacoes/:id', cotacaoController.show);
router.get('/cotacoes/:id/edit', cotacaoController.edit);
router.put('/cotacoes/:id', cotacaoController.update);
router.post('/cotacoes/:id/converter', cotacaoController.converter);
router.post('/cotacoes/:id/cancelar', cotacaoController.cancelar);
router.post('/cotacoes/:id/email', cotacaoController.enviar);
router.get('/cotacoes/:id/print', cotacaoController.print);
router.get('/cotacoes/relatorios/nao-convertidas', cotacaoController.relatoriosNaoConvertidas);
router.get('/cotacoes/relatorios/historico-cliente/:clienteId', cotacaoController.historicoPorCliente);

module.exports = router;
