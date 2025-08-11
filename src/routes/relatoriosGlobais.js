// ====================================
// src/routes/relatoriosGlobais.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');
const relatoriosGlobaisController = require('../controllers/relatoriosGlobaisController');

// Middleware de autenticação e permissão (apenas super admin)
router.use(authMiddleware);
router.use(permissionMiddleware([1])); // Apenas Super Admin

// Rota para receita da plataforma
router.get('/receita-plataforma', relatoriosGlobaisController.receitaPlataforma);

// Rota para análise de utilização
router.get('/utilizacao', relatoriosGlobaisController.analiseUtilizacao);

// Rota para crescimento e métricas
router.get('/crescimento', relatoriosGlobaisController.crescimentoMetricas);

module.exports = router;