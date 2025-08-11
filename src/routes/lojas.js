// ====================================
// src/routes/lojas.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');
const lojaController = require('../controllers/lojas/lojaController');

// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware);

// Dashboard multi-loja
router.get('/dashboard-lojas', permissionMiddleware([1, 2, 3]), lojaController.dashboard);

// CORRIGIR ESTAS ROTAS PARA CORRESPONDER AOS LINKS DO MENU:
// Gestão de lojas - corresponde ao link /lojas/gestao-lojas
router.get('/gestao-lojas', permissionMiddleware([1, 2, 3]), lojaController.index);

// Transferências entre lojas - corresponde ao link /lojas/transferencias-lojas
router.get('/transferencias-lojas', permissionMiddleware([1, 2, 3]), lojaController.transferencias);

// Relatórios consolidados - corresponde ao link /lojas/relatorios-consolidados
router.get('/relatorios-consolidados', permissionMiddleware([1, 2, 3]), lojaController.relatorios);

// Manter as rotas originais para compatibilidade
router.get('/funcionarios', permissionMiddleware([1, 2, 3]), lojaController.funcionarios);
router.get('/transferencias', permissionMiddleware([1, 2, 3]), lojaController.transferencias);
router.get('/relatorios', permissionMiddleware([1, 2, 3]), lojaController.relatorios);

// Gestão de lojas (CRUD)
router.get('/', permissionMiddleware([1, 2, 3]), lojaController.index);
router.get('/create', permissionMiddleware([1, 2, 3]), lojaController.create);
router.post('/', permissionMiddleware([1, 2, 3]), lojaController.store);
router.get('/:id', permissionMiddleware([1, 2, 3]), lojaController.show);
router.get('/:id/edit', permissionMiddleware([1, 2, 3]), lojaController.edit);
router.put('/:id', permissionMiddleware([1, 2, 3]), lojaController.update);
router.delete('/:id', permissionMiddleware([1, 2]), lojaController.destroy);

module.exports = router;