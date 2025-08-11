const { Cliente } = require('../models');

class DashboardController {
  async index(req, res) {
    try {
      const client_id = req.session.user.client_id;

      // Estatísticas básicas
      const stats = {
        totalClientes: await Cliente.count({ where: { client_id, status: 1 } }),
        totalFornecedores: 0, // Será implementado
        totalArtigos: 0,      // Será implementado
        artigosEmFalta: 0     // Será implementado
      };

      // Clientes recentes
      const clientesRecentes = await Cliente.findAll({
        where: { client_id },
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      // Vendas do mês (dados fictícios por enquanto)
      const vendasMes = {
        total: 45750.50,
        quantidade: 127,
        crescimento: 12.5
      };

      res.render('dashboard/index', {
        title: 'Dashboard - SYNTRA ERP',
        // Removido o layout: 'layouts/main' pois agora é padrão
        stats,
        vendasMes,
        clientesRecentes
      });

    } catch (error) {
      console.error('Erro no dashboard:', error);
      req.flash('error', 'Erro ao carregar dashboard');
      res.redirect('/');
    }
  }
}

module.exports = new DashboardController();