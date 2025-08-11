// ====================================
// src/middleware/auth.js
// ====================================
function authMiddleware(req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash('error', 'Acesso negado. Faça login para continuar.');
    return res.redirect('/auth/login');
  }

  // Verificar se usuário ainda está ativo
  // TODO: Adicionar verificação no banco de dados se necessário

  next();
}

module.exports = authMiddleware;