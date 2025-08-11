const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthController {
  async showLogin(req, res) {
    try {
      if (req.session && req.session.user) {
        return res.redirect('/dashboard');
      }
      
      res.render('auth/login', {
        title: 'Login - SYNTRA ERP',
        layout: false // Importante: não usar layout para login
      });
    } catch (error) {
      console.error('Erro ao exibir login:', error);
      res.redirect('/');
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        req.flash('error', 'Email e senha são obrigatórios');
        return res.redirect('/auth/login');
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        req.flash('error', 'Credenciais inválidas');
        return res.redirect('/auth/login');
      }

      const senhaValida = await bcrypt.compare(password, user.senha);

      if (!senhaValida) {
        req.flash('error', 'Credenciais inválidas');
        return res.redirect('/auth/login');
      }

      // Login bem-sucedido
      await user.update({ ultimo_login: new Date() });

      req.session.user = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        client_id: user.client_id
      };

      req.flash('success', 'Login realizado com sucesso!');
      res.redirect('/dashboard');

    } catch (error) {
      console.error('Erro no login:', error);
      req.flash('error', 'Erro interno. Tente novamente.');
      res.redirect('/auth/login');
    }
  }

  async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Erro ao destruir sessão:', err);
        }
        res.redirect('/auth/login');
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      res.redirect('/dashboard');
    }
  }
}

module.exports = new AuthController();