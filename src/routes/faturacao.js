// ====================================
// src/routes/faturacao.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');
const faturacaoController = require('../controllers/faturacaoController');

// Middleware de autenticação e permissão (apenas super admin)
router.use(authMiddleware);
router.use(permissionMiddleware([1])); // Apenas Super Admin

// Rota para assinaturas ativas
router.get('/assinaturas', faturacaoController.assinaturas);

// Rota para faturas emitidas
router.get('/faturas', faturacaoController.faturas);

// Rota para controlo de pagamentos
router.get('/pagamentos', faturacaoController.pagamentos);

// Rota para gestão de planos
router.get('/planos', faturacaoController.planos);

module.exports = router;