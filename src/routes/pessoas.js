
// ====================================
// src/routes/pessoas.js
// ====================================
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/pessoas/clienteController');
const fornecedorController = require('../controllers/pessoas/fornecedorController');
const utilizadorController = require('../controllers/pessoas/utilizadorController');
const importExportController = require('../controllers/pessoas/importExportController');

// Middleware de autenticação
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/auth/login');
  }
};

// Aplicar middleware de autenticação a todas as rotas
router.use(requireAuth);

// ====================================
// ROTAS DE CLIENTES
// ====================================
router.get('/clientes', clienteController.index);
router.get('/clientes/create', clienteController.create);
router.get('/clientes/export', clienteController.export);
router.post('/clientes/import', clienteController.import);
router.post('/clientes', clienteController.store);
router.get('/clientes/:id', clienteController.show);
router.get('/clientes/:id/edit', clienteController.edit);
router.put('/clientes/:id', clienteController.update);
router.delete('/clientes/:id', clienteController.destroy);

// ====================================
// ROTAS DE FORNECEDORES
// ====================================
router.get('/fornecedores', fornecedorController.index);
router.get('/fornecedores/create', fornecedorController.create);
router.get('/fornecedores/export', fornecedorController.export);
router.post('/fornecedores/import', fornecedorController.import);
router.post('/fornecedores', fornecedorController.store);
router.get('/fornecedores/:id', fornecedorController.show);
router.get('/fornecedores/:id/edit', fornecedorController.edit);
router.put('/fornecedores/:id', fornecedorController.update);
router.delete('/fornecedores/:id', fornecedorController.destroy);

// ====================================
// ROTAS DE UTILIZADORES
// ====================================
router.get('/utilizadores', utilizadorController.index);
router.get('/utilizadores/create', utilizadorController.create);
router.get('/utilizadores/export', utilizadorController.export);
router.post('/utilizadores/import', utilizadorController.import);
router.post('/utilizadores', utilizadorController.store);
router.get('/utilizadores/:id', utilizadorController.show);
router.get('/utilizadores/:id/edit', utilizadorController.edit);
router.put('/utilizadores/:id', utilizadorController.update);
router.delete('/utilizadores/:id', utilizadorController.destroy);
router.post('/utilizadores/:id/toggle-status', utilizadorController.toggleStatus);
router.post('/utilizadores/:id/reset-password', utilizadorController.resetPassword);

// ====================================
// ROTAS DE IMPORTAÇÃO/EXPORTAÇÃO
// ====================================
router.get('/import-export', importExportController.index);
router.get('/import-export/configuracoes', importExportController.configuracoes);
router.post('/import-export/import', importExportController.uploadMiddleware, importExportController.processImport);
router.post('/import-export/export', importExportController.export);
router.post('/import-export/validate', importExportController.uploadMiddleware, importExportController.validateFile);
router.get('/import-export/template/:tipo', importExportController.downloadTemplate);
router.post('/import-export/config', importExportController.saveConfig);

module.exports = router;