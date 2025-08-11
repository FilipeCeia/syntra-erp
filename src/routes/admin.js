// ====================================
// src/routes/admin.js
// ====================================
const express = require('express');
const router = express.Router();
const clienteEmpresaController = require('../controllers/admin/clienteEmpresaController');
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');

// Middleware de autenticação e permissão (apenas super admin)
router.use(authMiddleware);
router.use(permissionMiddleware([1])); // Apenas Super Admin

// Rotas de gestão de clientes/empresas
router.get('/clientes', clienteEmpresaController.index);
router.get('/clientes/dashboard', clienteEmpresaController.dashboard);
router.get('/clientes/create', clienteEmpresaController.create);
router.post('/clientes', clienteEmpresaController.store);

// Rota para modalidades de pagamento (temporária)
router.get('/modalidades', (req, res) => {
  res.render('admin/modalidades/index', {
    title: 'Modalidades de Pagamento - SYNTRA ERP'
  });
});

module.exports = router;