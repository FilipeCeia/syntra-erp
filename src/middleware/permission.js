// ====================================
// src/middleware/permission.js
// ====================================
function permissionMiddleware(requiredLevel) {
  return function(req, res, next) {
    if (!req.session || !req.session.user) {
      req.flash('error', 'Acesso negado.');
      return res.redirect('/auth/login');
    }

    const userLevel = req.session.user.perfil;
    
    // Níveis: 1=Admin Sistema, 2=Proprietário, 3=Gerente, 4=Vendas, 5=Caixa, 6=Stock, 7=Financeiro
    // Admin sistema e proprietário têm acesso total
    if (userLevel <= 2) {
      return next();
    }

    // Verificar se tem permissão específica
    if (Array.isArray(requiredLevel)) {
      if (requiredLevel.includes(userLevel)) {
        return next();
      }
    } else {
      if (userLevel === requiredLevel) {
        return next();
      }
    }

    req.flash('error', 'Acesso negado. Permissões insuficientes.');
    res.redirect('/dashboard');
  };
}

module.exports = permissionMiddleware;