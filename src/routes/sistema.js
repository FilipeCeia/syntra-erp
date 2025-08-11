// ====================================
// src/routes/sistema.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');
const sistemaController = require('../controllers/configuracoes/sistemaController');

router.use(authMiddleware);
router.use(permissionMiddleware([1, 2])); // Admin Sistema e Proprietário

// Rota principal - página de backup e recuperação
router.get('/', sistemaController.index);

// Criar backup manual
router.post('/backup', sistemaController.criarBackup);

// Restaurar backup
router.post('/restaurar', sistemaController.restaurarBackup);

// Atualizar configurações
router.post('/configuracoes', sistemaController.atualizarConfiguracoes);

module.exports = router;