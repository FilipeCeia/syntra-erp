// ====================================
// src/controllers/financas/contasReceberController.js
// ====================================

class ContasReceberController {
  // Listar contas a receber
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const status = req.query.status || 'todos';

      // Dados fictícios
      const contasReceber = [
        {
          id: 1,
          numero: 'CR-2024-001',
          cliente: { nome: 'Cliente Premium Lda', nuit: '400987654' },
          descricao: 'Venda de produtos',
          valor_original: 45000.00,
          valor_recebido: 20000.00,
          valor_pendente: 25000.00,
          data_emissao: new Date('2024-01-10'),
          data_vencimento: new Date('2024-02-10'),
          status: 'Parcial',
          categoria: 'Vendas'
        },
        {
          id: 2,
          numero: 'CR-2024-002',
          cliente: { nome: 'Empresa XYZ Lda', nuit: '400654321' },
          descricao: 'Prestação de serviços',
          valor_original: 18000.00,
          valor_recebido: 18000.00,
          valor_pendente: 0.00,
          data_emissao: new Date('2024-01-08'),
          data_vencimento: new Date('2024-01-23'),
          status: 'Recebido',
          categoria: 'Serviços'
        },
        {
          id: 3,
          numero: 'CR-2024-003',
          cliente: { nome: 'Comércio ABC', nuit: '400111222' },
          descricao: 'Venda a prazo',
          valor_original: 32000.00,
          valor_recebido: 0.00,
          valor_pendente: 32000.00,
          data_emissao: new Date('2024-01-12'),
          data_vencimento: new Date('2024-02-12'),
          status: 'Pendente',
          categoria: 'Vendas'
        }
      ];

      const totalContas = contasReceber.length;
      const totalPages = Math.ceil(totalContas / limit);

      res.render('financas/contas-receber', {
        title: 'Contas a Receber - SYNTRA ERP',
        layout: 'layouts/main',
        contasReceber,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalContas
        },
        filtros: { status },
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Finanças', link: '#' },
          { texto: 'Contas a Receber', link: '#' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar contas a receber:', error);
      req.flash('error', 'Erro ao carregar contas a receber');
      res.redirect('/financas/dashboard');
    }
  }

  // Criar nova conta a receber
  async create(req, res) {
    try {
      const clientes = [
        { id: 1, nome: 'Cliente Premium Lda', nuit: '400987654' },
        { id: 2, nome: 'Empresa XYZ Lda', nuit: '400654321' },
        { id: 3, nome: 'Comércio ABC', nuit: '400111222' }
      ];

      const categorias = [
        'Vendas',
        'Serviços',
        'Consultoria',
        'Aluguer',
        'Outros'
      ];

      res.render('financas/contas-receber-create', {
        title: 'Nova Conta a Receber - SYNTRA ERP',
        layout: 'layouts/main',
        clientes,
        categorias,
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Finanças', link: '#' },
          { texto: 'Contas a Receber', link: '/financas/contas-receber' },
          { texto: 'Nova Conta', link: '#' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar formulário:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/financas/contas-receber');
    }
  }

  // Salvar conta a receber
  async store(req, res) {
    try {
      // Aqui seria a lógica para salvar a conta
      req.flash('success', 'Conta a receber criada com sucesso!');
      res.redirect('/financas/contas-receber');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      req.flash('error', 'Erro ao criar conta a receber');
      res.redirect('/financas/contas-receber/create');
    }
  }

  // Exibir conta específica
  async show(req, res) {
    try {
      const { id } = req.params;
      
      const conta = {
        id: 1,
        numero: 'CR-2024-001',
        cliente: { nome: 'Cliente Premium Lda', nuit: '400987654' },
        descricao: 'Venda de produtos',
        valor_original: 45000.00,
        valor_recebido: 20000.00,
        valor_pendente: 25000.00,
        data_emissao: new Date('2024-01-10'),
        data_vencimento: new Date('2024-02-10'),
        status: 'Parcial',
        categoria: 'Vendas',
        observacoes: 'Cliente com histórico de bom pagador'
      };

      const historicoRecebimentos = [
        {
          id: 1,
          data: new Date('2024-01-15'),
          valor: 20000.00,
          forma_recebimento: 'Transferência Bancária',
          observacoes: 'Recebimento parcial'
        }
      ];

      res.render('financas/contas-receber-show', {
        title: `Conta a Receber ${conta.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        conta,
        historicoRecebimentos,
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Finanças', link: '#' },
          { texto: 'Contas a Receber', link: '/financas/contas-receber' },
          { texto: conta.numero, link: '#' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar conta:', error);
      req.flash('error', 'Erro ao carregar conta a receber');
      res.redirect('/financas/contas-receber');
    }
  }

  // Editar conta
  async edit(req, res) {
    try {
      const { id } = req.params;
      
      const conta = {
        id: 1,
        numero: 'CR-2024-001',
        cliente_id: 1,
        descricao: 'Venda de produtos',
        valor_original: 45000.00,
        data_emissao: new Date('2024-01-10'),
        data_vencimento: new Date('2024-02-10'),
        categoria: 'Vendas',
        observacoes: 'Cliente com histórico de bom pagador'
      };

      const clientes = [
        { id: 1, nome: 'Cliente Premium Lda', nuit: '400987654' },
        { id: 2, nome: 'Empresa XYZ Lda', nuit: '400654321' }
      ];

      const categorias = [
        'Vendas',
        'Serviços',
        'Consultoria'
      ];

      res.render('financas/contas-receber-edit', {
        title: `Editar Conta ${conta.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        conta,
        clientes,
        categorias,
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Finanças', link: '#' },
          { texto: 'Contas a Receber', link: '/financas/contas-receber' },
          { texto: 'Editar', link: '#' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar conta para edição:', error);
      req.flash('error', 'Erro ao carregar conta');
      res.redirect('/financas/contas-receber');
    }
  }

  // Atualizar conta
  async update(req, res) {
    try {
      const { id } = req.params;
      // Aqui seria a lógica para atualizar a conta
      req.flash('success', 'Conta atualizada com sucesso!');
      res.redirect(`/financas/contas-receber/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      req.flash('error', 'Erro ao atualizar conta');
      res.redirect(`/financas/contas-receber/${req.params.id}/edit`);
    }
  }

  // Processar recebimento
  async receber(req, res) {
    try {
      const { id } = req.params;
      // Aqui seria a lógica para processar o recebimento
      req.flash('success', 'Recebimento processado com sucesso!');
      res.redirect(`/financas/contas-receber/${id}`);
    } catch (error) {
      console.error('Erro ao processar recebimento:', error);
      req.flash('error', 'Erro ao processar recebimento');
      res.redirect(`/financas/contas-receber/${req.params.id}`);
    }
  }
}

module.exports = ContasReceberController;