const { Cliente } = require('../../models');
const { Op } = require('sequelize');

class ClienteEmpresaController {
  async index(req, res) {
    try {
      // Dados fictícios para clientes/empresas
      const clientes = [
        {
          id: 1,
          codigo: 'CLI001',
          nome: 'João Silva',
          nuit: '400123456',
          tipo: 1, // Particular
          telefone: '+258 84 123 4567',
          email: 'joao.silva@email.com',
          endereco: 'Av. Julius Nyerere, 123, Maputo',
          limite_credito: 50000.00,
          saldo_conta: 15000.00,
          status: 1,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: 2,
          codigo: 'EMP001',
          nome: 'Tech Solutions Lda',
          nuit: '400234567',
          tipo: 2, // Empresa
          telefone: '+258 21 456 789',
          email: 'info@techsolutions.co.mz',
          endereco: 'Av. Vladimir Lenine, 456, Maputo',
          limite_credito: 200000.00,
          saldo_conta: 75000.00,
          status: 1,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-25')
        },
        {
          id: 3,
          codigo: 'CLI002',
          nome: 'Maria Santos',
          nuit: '400345678',
          tipo: 1, // Particular
          telefone: '+258 87 987 6543',
          email: 'maria.santos@email.com',
          endereco: 'Rua da Paz, 789, Matola',
          limite_credito: 30000.00,
          saldo_conta: 8500.00,
          status: 1,
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-22')
        },
        {
          id: 4,
          codigo: 'EMP002',
          nome: 'Distribuidora XYZ',
          nuit: '400456789',
          tipo: 2, // Empresa
          telefone: '+258 21 789 123',
          email: 'vendas@distribuidoraxyz.co.mz',
          endereco: 'Av. 24 de Julho, 321, Maputo',
          limite_credito: 500000.00,
          saldo_conta: 125000.00,
          status: 0, // Inativo
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-18')
        }
      ];

      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const search = req.query.search || '';
      
      // Filtrar clientes baseado na pesquisa
      let clientesFiltrados = clientes;
      if (search) {
        clientesFiltrados = clientes.filter(cliente => 
          cliente.nome.toLowerCase().includes(search.toLowerCase()) ||
          cliente.codigo.toLowerCase().includes(search.toLowerCase()) ||
          cliente.telefone.includes(search)
        );
      }

      const totalRecords = clientesFiltrados.length;
      const totalPages = Math.ceil(totalRecords / limit);
      const startIndex = (page - 1) * limit;
      const clientesPaginados = clientesFiltrados.slice(startIndex, startIndex + limit);

      res.render('admin/clientes/index', {
        title: 'Gestão de Clientes/Empresas - SYNTRA ERP',
        clientes: clientesPaginados,
        currentPage: page,
        totalPages,
        search,
        totalRecords,
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Admin', link: '/admin' },
          { texto: 'Clientes/Empresas', link: '/admin/clientes' }
        ]
      });

    } catch (error) {
      console.error('Erro ao listar clientes/empresas:', error);
      req.flash('error', 'Erro ao carregar clientes/empresas');
      res.redirect('/admin');
    }
  }

  async create(req, res) {
    try {
      res.render('admin/clientes/create', {
        title: 'Novo Cliente/Empresa - SYNTRA ERP',
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Admin', link: '/admin' },
          { texto: 'Clientes/Empresas', link: '/admin/clientes' },
          { texto: 'Novo', link: '/admin/clientes/create' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar formulário:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/admin/clientes');
    }
  }

  async store(req, res) {
    try {
      // Simular criação de cliente
      console.log('Dados do novo cliente/empresa:', req.body);
      
      req.flash('success', 'Cliente/Empresa criado com sucesso!');
      res.redirect('/admin/clientes');
    } catch (error) {
      console.error('Erro ao criar cliente/empresa:', error);
      req.flash('error', 'Erro ao criar cliente/empresa');
      res.redirect('/admin/clientes/create');
    }
  }

  async dashboard(req, res) {
    try {
      // Dados fictícios para estatísticas
      const stats = {
        totalClientes: 156,
        clientesAtivos: 142,
        clientesInativos: 14,
        empresas: 45
      };

      // Clientes recentes fictícios
      const clientesRecentes = [
        {
          id: 1,
          codigo: 'CLI001',
          nome: 'João Silva',
          tipo: 1,
          telefone: '+258 84 123 4567',
          email: 'joao.silva@email.com',
          status: 1,
          createdAt: new Date('2024-01-25')
        },
        {
          id: 2,
          codigo: 'EMP001',
          nome: 'Tech Solutions Lda',
          tipo: 2,
          telefone: '+258 21 456 789',
          email: 'info@techsolutions.co.mz',
          status: 1,
          createdAt: new Date('2024-01-24')
        },
        {
          id: 3,
          codigo: 'CLI002',
          nome: 'Maria Santos',
          tipo: 1,
          telefone: '+258 87 987 6543',
          email: 'maria.santos@email.com',
          status: 1,
          createdAt: new Date('2024-01-23')
        },
        {
          id: 4,
          codigo: 'EMP002',
          nome: 'Distribuidora XYZ',
          tipo: 2,
          telefone: '+258 21 789 123',
          email: 'vendas@distribuidoraxyz.co.mz',
          status: 1,
          createdAt: new Date('2024-01-22')
        },
        {
          id: 5,
          codigo: 'CLI003',
          nome: 'Pedro Costa',
          tipo: 1,
          telefone: '+258 85 555 4444',
          email: 'pedro.costa@email.com',
          status: 1,
          createdAt: new Date('2024-01-21')
        }
      ];

      res.render('admin/clientes/dashboard', {
        title: 'Dashboard de Clientes - SYNTRA ERP',
        stats,
        clientesRecentes,
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Admin', link: '/admin' },
          { texto: 'Dashboard Clientes', link: '/admin/clientes/dashboard' }
        ],
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });

    } catch (error) {
      console.error('Erro no dashboard de clientes:', error);
      req.flash('error', 'Erro ao carregar dashboard de clientes');
      res.redirect('/admin');
    }
  }
}

module.exports = new ClienteEmpresaController();