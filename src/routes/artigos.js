// ====================================
// src/routes/artigos.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');

// Aplicar middleware de autenticação
router.use(authMiddleware);

// Controllers
const produtoController = require('../controllers/artigos/produtoController');
const categoriaController = require('../controllers/artigos/categoriaController');
const ivaController = require('../controllers/artigos/ivaController');

// Rotas de produtos/artigos
router.get('/produtos', produtoController.index);
router.get('/produtos/create', produtoController.create);
router.post('/produtos', produtoController.store);
router.get('/produtos/:id', produtoController.show);
router.get('/produtos/:id/edit', produtoController.edit);
router.put('/produtos/:id', produtoController.update);
router.delete('/produtos/:id', produtoController.destroy);
router.post('/produtos/gerar-codigo-barras', produtoController.gerarCodigoBarras);

// Rotas de categorias
router.get('/categorias', categoriaController.index);
router.get('/categorias/create', categoriaController.create);
router.post('/categorias', categoriaController.store);
router.get('/categorias/:id', categoriaController.show);
router.get('/categorias/:id/edit', categoriaController.edit);
router.put('/categorias/:id', categoriaController.update);
router.delete('/categorias/:id', categoriaController.destroy);

// Rotas de IVA
router.get('/iva', ivaController.index);
router.get('/iva/create', ivaController.create);
router.post('/iva', ivaController.store);
router.get('/iva/:id', ivaController.show);
router.get('/iva/:id/edit', ivaController.edit);
router.put('/iva/:id', ivaController.update);
router.delete('/iva/:id', ivaController.destroy);
router.get('/api/iva/ativas', ivaController.getTaxasAtivas);
router.post('/iva/:id/duplicate', ivaController.duplicate);

// Rotas de códigos de barras
router.get('/codigos-barras', (req, res) => {
  res.render('artigos/codigos-barras/index', {
    title: 'Códigos de Barras - SYNTRA ERP',
    layout: 'layouts/main'
  });
});

module.exports = router;