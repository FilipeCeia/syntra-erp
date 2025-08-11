// ====================================
// src/routes/plataforma.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');
const plataformaController = require('../controllers/plataformaController');

// Middleware de autenticação e permissão (apenas super admin)
router.use(authMiddleware);
router.use(permissionMiddleware([1])); // Apenas Super Admin

// Rota para monitoramento do sistema
router.get('/monitoramento', plataformaController.monitoramento);

// Rota para performance e analytics
router.get('/performance', plataformaController.performance);

// Rota para configurações globais
router.get('/configuracoes', plataformaController.configuracoes);

// Rota para backups e recuperação
router.get('/backups', plataformaController.backups);

module.exports = router;