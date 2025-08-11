// ====================================
// src/middleware/tenant.js
// ====================================
function tenantMiddleware(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user.client_id) {
    req.flash('error', 'Sessão inválida. Faça login novamente.');
    return res.redirect('/auth/login');
  }

  // Adicionar client_id no res.locals para uso nos templates
  res.locals.client_id = req.session.user.client_id;
  
  next();
}

module.exports = tenantMiddleware;