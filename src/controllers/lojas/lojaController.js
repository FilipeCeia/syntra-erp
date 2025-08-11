// ====================================
// src/controllers/lojas/lojaController.js
// ====================================
const { Loja, User } = require('../../models');
const { Op } = require('sequelize');

class LojaController {
  // Dashboard multi-loja
  async dashboard(req, res) {
    try {
      // Dados fictícios para o dashboard
      const dashboardData = {
        totalLojas: 5,
        lojasAtivas: 4,
        lojasInativas: 1,
        totalFuncionarios: 23,
        vendasHoje: {
          total: 15420.50,
          transacoes: 87
        },
        vendasMes: {
          total: 342150.75,
          transacoes: 1456
        },
        topLojas: [
          {
            id: 1,
            nome: 'Loja Centro',
            vendas: 125430.20,
            transacoes: 456,
            crescimento: 12.5
          },
          {
            id: 2,
            nome: 'Loja Shopping',
            vendas: 98750.30,
            transacoes: 387,
            crescimento: 8.3
          },
          {
            id: 3,
            nome: 'Loja Aeroporto',
            vendas: 76890.15,
            transacoes: 298,
            crescimento: -2.1
          }
        ],
        alertas: [
          {
            tipo: 'warning',
            mensagem: 'Loja Bairro Alto com estoque baixo em 5 produtos',
            loja: 'Loja Bairro Alto'
          },
          {
            tipo: 'info',
            mensagem: 'Transferência pendente entre Loja Centro e Loja Shopping',
            loja: 'Sistema'
          }
        ]
      };

      res.render('lojas/dashboard', {
        title: 'Dashboard Multi-loja - SYNTRA ERP',
        layout: 'layouts/main',
        dashboardData
      });
    } catch (error) {
      console.error('Erro no dashboard multi-loja:', error);
      req.flash('error', 'Erro ao carregar dashboard');
      res.redirect('/dashboard');
    }
  }

  // Listar lojas
  async index(req, res) {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = req.query;
      
      // Dados fictícios de lojas
      const lojasFicticias = [
        {
          id: 1,
          codigo: 'LJ001',
          nome: 'Loja Centro',
          endereco: 'Av. Julius Nyerere, 123, Maputo',
          telefone: '+258 21 123 456',
          email: 'centro@syntra.co.mz',
          gerente: 'João Silva',
          status: 1,
          funcionarios: 8,
          vendas_mes: 125430.20,
          meta_mes: 150000.00,
          data_abertura: new Date('2023-01-15'),
          createdAt: new Date('2023-01-15')
        },
        {
          id: 2,
          codigo: 'LJ002',
          nome: 'Loja Shopping',
          endereco: 'Shopping Maputo, Loja 45',
          telefone: '+258 21 234 567',
          email: 'shopping@syntra.co.mz',
          gerente: 'Maria Santos',
          status: 1,
          funcionarios: 6,
          vendas_mes: 98750.30,
          meta_mes: 120000.00,
          data_abertura: new Date('2023-03-10'),
          createdAt: new Date('2023-03-10')
        },
        {
          id: 3,
          codigo: 'LJ003',
          nome: 'Loja Aeroporto',
          endereco: 'Aeroporto Internacional de Maputo',
          telefone: '+258 21 345 678',
          email: 'aeroporto@syntra.co.mz',
          gerente: 'Carlos Mondlane',
          status: 1,
          funcionarios: 4,
          vendas_mes: 76890.15,
          meta_mes: 80000.00,
          data_abertura: new Date('2023-06-20'),
          createdAt: new Date('2023-06-20')
        },
        {
          id: 4,
          codigo: 'LJ004',
          nome: 'Loja Bairro Alto',
          endereco: 'Av. Acordos de Lusaka, 456',
          telefone: '+258 21 456 789',
          email: 'bairroalto@syntra.co.mz',
          gerente: 'Ana Macamo',
          status: 1,
          funcionarios: 3,
          vendas_mes: 45230.80,
          meta_mes: 60000.00,
          data_abertura: new Date('2023-09-05'),
          createdAt: new Date('2023-09-05')
        },
        {
          id: 5,
          codigo: 'LJ005',
          nome: 'Loja Matola',
          endereco: 'Av. da Independência, 789, Matola',
          telefone: '+258 21 567 890',
          email: 'matola@syntra.co.mz',
          gerente: 'Pedro Chissano',
          status: 0,
          funcionarios: 2,
          vendas_mes: 0.00,
          meta_mes: 50000.00,
          data_abertura: new Date('2024-01-10'),
          createdAt: new Date('2024-01-10')
        }
      ];

      // Filtrar lojas baseado na busca
      let lojasFiltradas = lojasFicticias;
      if (search) {
        lojasFiltradas = lojasFicticias.filter(loja => 
          loja.nome.toLowerCase().includes(search.toLowerCase()) ||
          loja.codigo.toLowerCase().includes(search.toLowerCase()) ||
          loja.endereco.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (status !== '') {
        lojasFiltradas = lojasFiltradas.filter(loja => loja.status == status);
      }

      // Paginação
      const totalItems = lojasFiltradas.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const lojas = lojasFiltradas.slice(startIndex, startIndex + parseInt(limit));

      res.render('lojas/index', {
        title: 'Gestão de Lojas - SYNTRA ERP',
        layout: 'layouts/main',
        lojas,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          limit: parseInt(limit)
        },
        filters: {
          search,
          status
        }
      });
    } catch (error) {
      console.error('Erro ao listar lojas:', error);
      req.flash('error', 'Erro ao carregar lojas');
      res.redirect('/dashboard');
    }
  }

  // Exibir formulário de criação
  async create(req, res) {
    try {
      // Dados fictícios para o formulário
      const gerentes = [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' },
        { id: 3, nome: 'Carlos Mondlane' },
        { id: 4, nome: 'Ana Macamo' },
        { id: 5, nome: 'Pedro Chissano' }
      ];

      res.render('lojas/create', {
        title: 'Nova Loja - SYNTRA ERP',
        layout: 'layouts/main',
        gerentes
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de criação:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/lojas');
    }
  }

  // Criar nova loja
  async store(req, res) {
    try {
      req.flash('success', 'Loja criada com sucesso!');
      res.redirect('/lojas');
    } catch (error) {
      console.error('Erro ao criar loja:', error);
      req.flash('error', 'Erro ao criar loja');
      res.redirect('/lojas/create');
    }
  }

  // Exibir detalhes da loja
  async show(req, res) {
    try {
      const { id } = req.params;
      
      // Dados fictícios da loja
      const loja = {
        id: parseInt(id),
        codigo: 'LJ001',
        nome: 'Loja Centro',
        endereco: 'Av. Julius Nyerere, 123, Maputo',
        telefone: '+258 21 123 456',
        email: 'centro@syntra.co.mz',
        gerente: 'João Silva',
        status: 1,
        funcionarios: [
          { id: 1, nome: 'João Silva', cargo: 'Gerente', status: 'Ativo' },
          { id: 2, nome: 'Maria Costa', cargo: 'Vendedor', status: 'Ativo' },
          { id: 3, nome: 'Pedro Langa', cargo: 'Caixa', status: 'Ativo' }
        ],
        vendas_hoje: 2450.30,
        vendas_mes: 125430.20,
        meta_mes: 150000.00,
        produtos_estoque: 156,
        produtos_baixo_estoque: 5,
        data_abertura: new Date('2023-01-15')
      };

      // Estatísticas da loja
      const estatisticas = {
        funcionarios: loja.funcionarios.length,
        vendas_mes: loja.vendas_mes,
        meta_mensal: loja.meta_mes,
        percentual_meta: Math.round((loja.vendas_mes / loja.meta_mes) * 100)
      };

      // Top produtos da loja
      const top_produtos = [
        { nome: 'Smartphone Samsung A54', quantidade: 15, valor: 22500.00 },
        { nome: 'Notebook Dell Inspiron', quantidade: 8, valor: 24000.00 },
        { nome: 'Fones Bluetooth', quantidade: 25, valor: 6250.00 }
      ];

      // Funcionários da loja (dados fictícios expandidos)
      const funcionarios = [
        {
          id: 1,
          nome: 'João Silva',
          cargo: 'Gerente',
          email: 'joao.silva@syntra.co.mz',
          telefone: '+258 84 123 456',
          data_admissao: new Date('2023-01-15'),
          salario: 35000.00,
          status: 'Ativo'
        },
        {
          id: 2,
          nome: 'Maria Costa',
          cargo: 'Vendedor',
          email: 'maria.costa@syntra.co.mz',
          telefone: '+258 84 234 567',
          data_admissao: new Date('2023-03-10'),
          salario: 25000.00,
          status: 'Ativo'
        },
        {
          id: 3,
          nome: 'Pedro Langa',
          cargo: 'Caixa',
          email: 'pedro.langa@syntra.co.mz',
          telefone: '+258 84 345 678',
          data_admissao: new Date('2023-05-20'),
          salario: 20000.00,
          status: 'Ativo'
        }
      ];

      // Transferências recentes
      const transferencias_recentes = [
        {
          codigo: 'TRF001',
          tipo: 'Produtos',
          origem: 'Loja Centro',
          destino: 'Loja Shopping',
          detalhes: '15 produtos transferidos',
          data: new Date('2024-01-15'),
          status: 'Concluída'
        },
        {
          codigo: 'TRF002',
          tipo: 'Funcionário',
          origem: 'Loja Shopping',
          destino: 'Loja Centro',
          detalhes: 'Ana Silva transferida',
          data: new Date('2024-01-10'),
          status: 'Pendente'
        }
      ];

      // Performance mensal para gráfico
      const performance_mensal = [
        { mes: 'Jan', vendas: 125430.20, meta: 150000.00 },
        { mes: 'Fev', vendas: 142350.80, meta: 150000.00 },
        { mes: 'Mar', vendas: 138920.50, meta: 150000.00 }
      ];

      res.render('lojas/show', {
        title: `${loja.nome} - SYNTRA ERP`,
        layout: 'layouts/main',
        loja,
        estatisticas,
        top_produtos,
        funcionarios,
        transferencias_recentes,
        performance_mensal
      });
    } catch (error) {
      console.error('Erro ao exibir loja:', error);
      req.flash('error', 'Erro ao carregar loja');
      res.redirect('/lojas');
    }
  }

  // Exibir formulário de edição
  async edit(req, res) {
    try {
      const { id } = req.params;
      
      // Dados fictícios
      const loja = {
        id: parseInt(id),
        codigo: 'LJ001',
        nome: 'Loja Centro',
        endereco: 'Av. Julius Nyerere, 123, Maputo',
        telefone: '+258 21 123 456',
        email: 'centro@syntra.co.mz',
        gerente_id: 1,
        status: 1,
        meta_mes: 150000.00,
        observacoes: 'Loja principal no centro da cidade'
      };

      const gerentes = [
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' },
        { id: 3, nome: 'Carlos Mondlane' }
      ];

      // Calcular estatísticas da loja
      const estatisticas = {
        funcionarios: 12,
        vendas_mes: loja.meta_mes * 0.85, // 85% da meta
        meta_mensal: loja.meta_mes,
        percentual_meta: 85.0
      };

      res.render('lojas/edit', {
        title: `Editar ${loja.nome} - SYNTRA ERP`,
        layout: 'layouts/main',
        loja,
        gerentes,
        estatisticas
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de edição:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/lojas');
    }
  }

  // Atualizar loja
  async update(req, res) {
    try {
      const { id } = req.params;
      req.flash('success', 'Loja atualizada com sucesso!');
      res.redirect(`/lojas/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar loja:', error);
      req.flash('error', 'Erro ao atualizar loja');
      res.redirect(`/lojas/${req.params.id}/edit`);
    }
  }

  // Excluir loja
  async destroy(req, res) {
    try {
      const { id } = req.params;
      req.flash('success', 'Loja excluída com sucesso!');
      res.redirect('/lojas');
    } catch (error) {
      console.error('Erro ao excluir loja:', error);
      req.flash('error', 'Erro ao excluir loja');
      res.redirect('/lojas');
    }
  }

  // Gestão de funcionários
  async funcionarios(req, res) {
    try {
      const { page = 1, limit = 10, search = '', loja_id = '' } = req.query;
      
      // Dados fictícios de funcionários
      const funcionariosFicticios = [
        {
          id: 1,
          nome: 'João Silva',
          email: 'joao.silva@syntra.co.mz',
          cargo: 'Gerente',
          loja: 'Loja Centro',
          loja_id: 1,
          salario: 25000.00,
          data_admissao: new Date('2023-01-15'),
          status: 'Ativo'
        },
        {
          id: 2,
          nome: 'Maria Santos',
          email: 'maria.santos@syntra.co.mz',
          cargo: 'Gerente',
          loja: 'Loja Shopping',
          loja_id: 2,
          salario: 24000.00,
          data_admissao: new Date('2023-03-10'),
          status: 'Ativo'
        },
        {
          id: 3,
          nome: 'Carlos Mondlane',
          email: 'carlos.mondlane@syntra.co.mz',
          cargo: 'Vendedor',
          loja: 'Loja Centro',
          loja_id: 1,
          salario: 15000.00,
          data_admissao: new Date('2023-02-01'),
          status: 'Ativo'
        },
        {
          id: 4,
          nome: 'Ana Macamo',
          email: 'ana.macamo@syntra.co.mz',
          cargo: 'Caixa',
          loja: 'Loja Shopping',
          loja_id: 2,
          salario: 12000.00,
          data_admissao: new Date('2023-04-15'),
          status: 'Ativo'
        },
        {
          id: 5,
          nome: 'Pedro Chissano',
          email: 'pedro.chissano@syntra.co.mz',
          cargo: 'Vendedor',
          loja: 'Loja Aeroporto',
          loja_id: 3,
          salario: 14000.00,
          data_admissao: new Date('2023-06-20'),
          status: 'Férias'
        }
      ];

      const lojas = [
        { id: 1, nome: 'Loja Centro' },
        { id: 2, nome: 'Loja Shopping' },
        { id: 3, nome: 'Loja Aeroporto' },
        { id: 4, nome: 'Loja Bairro Alto' }
      ];

      // Filtrar funcionários
      let funcionariosFiltrados = funcionariosFicticios;
      if (search) {
        funcionariosFiltrados = funcionariosFicticios.filter(func => 
          func.nome.toLowerCase().includes(search.toLowerCase()) ||
          func.email.toLowerCase().includes(search.toLowerCase()) ||
          func.cargo.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (loja_id) {
        funcionariosFiltrados = funcionariosFiltrados.filter(func => func.loja_id == loja_id);
      }

      // Paginação
      const totalItems = funcionariosFiltrados.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const funcionarios = funcionariosFiltrados.slice(startIndex, startIndex + parseInt(limit));

      res.render('lojas/funcionarios', {
        title: 'Funcionários das Lojas - SYNTRA ERP',
        layout: 'layouts/main',
        funcionarios,
        lojas,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          limit: parseInt(limit)
        },
        filters: {
          search,
          loja_id
        }
      });
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      req.flash('error', 'Erro ao carregar funcionários');
      res.redirect('/lojas');
    }
  }

  // Transferências entre lojas
  async transferencias(req, res) {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = req.query;
      
      // Dados fictícios de transferências
      const transferenciasFicticias = [
        {
          id: 1,
          codigo: 'TRF001',
          loja_origem: 'Loja Centro',
          loja_destino: 'Loja Shopping',
          tipo: 'Produtos',
          total_itens: 15,
          valor_total: 12450.30,
          status: 'Pendente',
          data_solicitacao: new Date('2024-01-15'),
          solicitante: 'João Silva'
        },
        {
          id: 2,
          codigo: 'TRF002',
          loja_origem: 'Loja Shopping',
          loja_destino: 'Loja Aeroporto',
          tipo: 'Funcionário',
          funcionario: 'Maria Costa',
          status: 'Aprovada',
          data_solicitacao: new Date('2024-01-10'),
          data_aprovacao: new Date('2024-01-12'),
          solicitante: 'Maria Santos'
        },
        {
          id: 3,
          codigo: 'TRF003',
          loja_origem: 'Loja Centro',
          loja_destino: 'Loja Bairro Alto',
          tipo: 'Produtos',
          total_itens: 8,
          valor_total: 3250.75,
          status: 'Concluída',
          data_solicitacao: new Date('2024-01-08'),
          data_conclusao: new Date('2024-01-09'),
          solicitante: 'João Silva'
        }
      ];

      // Filtrar transferências
      let transferenciasFiltradas = transferenciasFicticias;
      if (search) {
        transferenciasFiltradas = transferenciasFicticias.filter(trans => 
          trans.codigo.toLowerCase().includes(search.toLowerCase()) ||
          trans.loja_origem.toLowerCase().includes(search.toLowerCase()) ||
          trans.loja_destino.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (status) {
        transferenciasFiltradas = transferenciasFiltradas.filter(trans => trans.status === status);
      }

      // Paginação
      const totalItems = transferenciasFiltradas.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const transferencias = transferenciasFiltradas.slice(startIndex, startIndex + parseInt(limit));

      const lojas = [
        { id: 1, nome: 'Loja Centro' },
        { id: 2, nome: 'Loja Shopping' },
        { id: 3, nome: 'Loja Aeroporto' },
        { id: 4, nome: 'Loja Bairro Alto' }
      ];

      res.render('lojas/transferencias', {
        title: 'Transferências entre Lojas - SYNTRA ERP',
        layout: 'layouts/main',
        transferencias,
        lojas,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          limit: parseInt(limit)
        },
        filters: {
          search,
          status
        }
      });
    } catch (error) {
      console.error('Erro ao listar transferências:', error);
      req.flash('error', 'Erro ao carregar transferências');
      res.redirect('/lojas');
    }
  }

  // Relatórios consolidados
  async relatorios(req, res) {
    try {
      const { data_inicio = '', data_fim = '', loja_id = '' } = req.query;
      
      // Dados fictícios para relatórios
      const relatoriosData = {
        periodo: 'Janeiro 2024',
        resumo: {
          total_vendas: 342150.75,
          total_transacoes: 1456,
          ticket_medio: 234.89,
          crescimento: 8.5
        },
        vendas_por_loja: [
          { loja: 'Loja Centro', vendas: 125430.20, participacao: 36.7 },
          { loja: 'Loja Shopping', vendas: 98750.30, participacao: 28.9 },
          { loja: 'Loja Aeroporto', vendas: 76890.15, participacao: 22.5 },
          { loja: 'Loja Bairro Alto', vendas: 41080.10, participacao: 12.0 }
        ],
        produtos_mais_vendidos: [
          { produto: 'Smartphone Samsung A54', quantidade: 45, valor: 67500.00 },
          { produto: 'Notebook Dell Inspiron', quantidade: 12, valor: 36000.00 },
          { produto: 'Fones Bluetooth', quantidade: 89, valor: 22250.00 }
        ],
        funcionarios_destaque: [
          { nome: 'Maria Costa', loja: 'Loja Centro', vendas: 45230.50 },
          { nome: 'Pedro Langa', loja: 'Loja Shopping', vendas: 38750.20 },
          { nome: 'Ana Silva', loja: 'Loja Aeroporto', vendas: 32100.80 }
        ]
      };

      // Dados adicionais necessários para a view
      const resumo = {
        vendas_total: 342150.75,
        lucro_total: 85537.69,
        total_funcionarios: 48,
        produtos_vendidos: 1456
      };

      const lojas = [
        { 
          id: 1, 
          nome: 'Loja Centro', 
          codigo: 'LJ001',
          vendas: 125430.20, 
          meta: 150000.00,
          percentual_meta: 83.6,
          lucro: 31357.55,
          funcionarios: 15,
          vendas_por_funcionario: 8362.01
        },
        { 
          id: 2, 
          nome: 'Loja Shopping', 
          codigo: 'LJ002',
          vendas: 98750.30, 
          meta: 120000.00,
          percentual_meta: 82.3,
          lucro: 24687.58,
          funcionarios: 12,
          vendas_por_funcionario: 8229.19
        },
        { 
          id: 3, 
          nome: 'Loja Aeroporto', 
          codigo: 'LJ003',
          vendas: 76890.15, 
          meta: 100000.00,
          percentual_meta: 76.9,
          lucro: 19222.54,
          funcionarios: 10,
          vendas_por_funcionario: 7689.02
        },
        { 
          id: 4, 
          nome: 'Loja Bairro Alto', 
          codigo: 'LJ004',
          vendas: 41080.10, 
          meta: 80000.00,
          percentual_meta: 51.4,
          lucro: 10270.03,
          funcionarios: 8,
          vendas_por_funcionario: 5135.01
        }
      ];

      const transferencias = [
        {
          tipo: 'Produtos',
          data: new Date('2024-01-15'),
          origem: 'Loja Centro',
          destino: 'Loja Shopping',
          detalhes: '15 produtos transferidos',
          status: 'Concluída'
        },
        {
          tipo: 'Funcionário',
          data: new Date('2024-01-10'),
          origem: 'Loja Shopping',
          destino: 'Loja Aeroporto',
          detalhes: 'Maria Costa transferida',
          status: 'Pendente'
        }
      ];

      const indicadores = {
        tempo_medio_transferencia: 3,
        taxa_sucesso: 94,
        produtos_transferidos: 245,
        funcionarios_transferidos: 8
      };

      const alertas = [
        {
          tipo: 'warning',
          icone: 'exclamation-triangle',
          titulo: 'Meta não atingida',
          mensagem: 'Loja Bairro Alto está 48.6% abaixo da meta mensal'
        }
      ];

      const performance = [
        { nome: 'Loja Centro', vendas: 125430.20, meta: 150000.00 },
        { nome: 'Loja Shopping', vendas: 98750.30, meta: 120000.00 },
        { nome: 'Loja Aeroporto', vendas: 76890.15, meta: 100000.00 },
        { nome: 'Loja Bairro Alto', vendas: 41080.10, meta: 80000.00 }
      ];

      const top_produtos = [
        { nome: 'Smartphone Samsung A54', vendas: 67500.00 },
        { nome: 'Notebook Dell Inspiron', vendas: 36000.00 },
        { nome: 'Fones Bluetooth', vendas: 22250.00 }
      ];

      res.render('lojas/relatorios', {
        title: 'Relatórios Consolidados - SYNTRA ERP',
        layout: 'layouts/main',
        relatoriosData,
        resumo,
        lojas,
        transferencias,
        indicadores,
        alertas,
        performance,
        top_produtos,
        filters: {
          data_inicio,
          data_fim,
          loja_id
        }
      });
    } catch (error) {
      console.error('Erro ao gerar relatórios:', error);
      req.flash('error', 'Erro ao carregar relatórios');
      res.redirect('/lojas');
    }
  }
}

module.exports = new LojaController();