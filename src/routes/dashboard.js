const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Middleware de autenticação
function authMiddleware(req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash('error', 'Acesso negado. Faça login para continuar.');
    return res.redirect('/auth/login');
  }
  next();
}

router.use(authMiddleware);
router.get('/', dashboardController.index);

module.exports = router;