// ====================================
// src/routes/empresa.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');
const empresaController = require('../controllers/configuracoes/empresaController');

router.use(authMiddleware);
router.use(permissionMiddleware([1, 2])); // Admin Sistema e Proprietário

// Rota principal - exibir dados da empresa
router.get('/', empresaController.index);

// Atualizar dados da empresa
router.post('/', empresaController.update);

module.exports = router;