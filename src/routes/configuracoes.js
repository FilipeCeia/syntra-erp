// ====================================
// src/routes/configuracoes.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');
const empresaController = require('../controllers/configuracoes/empresaController');
const sistemaController = require('../controllers/configuracoes/sistemaController');

router.use(authMiddleware);
router.use(permissionMiddleware([1, 2])); // Admin Sistema e Proprietário

// Rotas existentes
router.get('/', (req, res) => {
  res.render('configuracoes/sistema/index', {
    title: 'Configurações - SYNTRA ERP',
    layout: 'layouts/main'
  });
});

router.get('/perfil', (req, res) => {
  res.render('configuracoes/perfil/index', {
    title: 'Meu Perfil - SYNTRA ERP',
    layout: 'layouts/main'
  });
});

router.get('/sistema', (req, res) => {
  res.render('configuracoes/sistema/index', {
    title: 'Configurações do Sistema - SYNTRA ERP',
    layout: 'layouts/main'
  });
});

module.exports = router;