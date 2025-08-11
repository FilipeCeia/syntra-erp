// ====================================
// src/controllers/financas/contasPagarController.js
// ====================================

class ContasPagarController {
  // Listar contas a pagar
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const status = req.query.status || 'todos';

      // Dados fictícios
      const contasPagar = [
        {
          id: 1,
          numero: 'CP-2024-001',
          fornecedor: { nome: 'Fornecedor ABC Lda', nuit: '400123456' },
          descricao: 'Compra de mercadorias',
          valor_original: 25000.00,
          valor_pago: 0.00,
          valor_pendente: 25000.00,
          data_emissao: new Date('2024-01-15'),
          data_vencimento: new Date('2024-02-15'),
          status: 'Pendente',
          categoria: 'Fornecedores'
        },
        {
          id: 2,
          numero: 'CP-2024-002',
          fornecedor: { nome: 'Energia de Moçambique', nuit: '400789123' },
          descricao: 'Conta de electricidade',
          valor_original: 8500.00,
          valor_pago: 8500.00,
          valor_pendente: 0.00,
          data_emissao: new Date('2024-01-10'),
          data_vencimento: new Date('2024-01-25'),
          status: 'Pago',
          categoria: 'Utilidades'
        },
        {
          id: 3,
          numero: 'CP-2024-003',
          fornecedor: { nome: 'Telecomunicações de Moçambique', nuit: '400456789' },
          descricao: 'Serviços de telecomunicações',
          valor_original: 12000.00,
          valor_pago: 6000.00,
          valor_pendente: 6000.00,
          data_emissao: new Date('2024-01-12'),
          data_vencimento: new Date('2024-02-12'),
          status: 'Parcial',
          categoria: 'Telecomunicações'
        }
      ];

      const totalContas = contasPagar.length;
      const totalPages = Math.ceil(totalContas / limit);

      res.render('financas/contas-pagar', {
        title: 'Contas a Pagar - SYNTRA ERP',
        layout: 'layouts/main',
        contasPagar,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalContas
        },
        filtros: { status },
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Finanças', link: '#' },
          { texto: 'Contas a Pagar', link: '#' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar contas a pagar:', error);
      req.flash('error', 'Erro ao carregar contas a pagar');
      res.redirect('/financas/dashboard');
    }
  }

  // Criar nova conta a pagar
  async create(req, res) {
    try {
      const fornecedores = [
        { id: 1, nome: 'Fornecedor ABC Lda', nuit: '400123456' },
        { id: 2, nome: 'Energia de Moçambique', nuit: '400789123' },
        { id: 3, nome: 'Telecomunicações de Moçambique', nuit: '400456789' }
      ];

      const categorias = [
        'Fornecedores',
        'Utilidades',
        'Telecomunicações',
        'Combustível',
        'Material Escritório',
        'Serviços Profissionais'
      ];

      res.render('financas/contas-pagar-create', {
        title: 'Nova Conta a Pagar - SYNTRA ERP',
        layout: 'layouts/main',
        fornecedores,
        categorias,
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Finanças', link: '#' },
          { texto: 'Contas a Pagar', link: '/financas/contas-pagar' },
          { texto: 'Nova Conta', link: '#' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar formulário:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/financas/contas-pagar');
    }
  }

  // Salvar conta a pagar
  async store(req, res) {
    try {
      // Aqui seria a lógica para salvar a conta
      req.flash('success', 'Conta a pagar criada com sucesso!');
      res.redirect('/financas/contas-pagar');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      req.flash('error', 'Erro ao criar conta a pagar');
      res.redirect('/financas/contas-pagar/create');
    }
  }

  // Exibir conta específica
  async show(req, res) {
    try {
      const { id } = req.params;
      
      const conta = {
        id: 1,
        numero: 'CP-2024-001',
        fornecedor: { nome: 'Fornecedor ABC Lda', nuit: '400123456' },
        descricao: 'Compra de mercadorias',
        valor_original: 25000.00,
        valor_pago: 0.00,
        valor_pendente: 25000.00,
        data_emissao: new Date('2024-01-15'),
        data_vencimento: new Date('2024-02-15'),
        status: 'Pendente',
        categoria: 'Fornecedores',
        observacoes: 'Pagamento conforme acordo comercial'
      };

      const historicoPagamentos = [
        {
          id: 1,
          data: new Date('2024-01-20'),
          valor: 10000.00,
          forma_pagamento: 'Transferência Bancária',
          observacoes: 'Pagamento parcial'
        }
      ];

      res.render('financas/contas-pagar-show', {
        title: `Conta a Pagar ${conta.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        conta,
        historicoPagamentos,
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Finanças', link: '#' },
          { texto: 'Contas a Pagar', link: '/financas/contas-pagar' },
          { texto: conta.numero, link: '#' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar conta:', error);
      req.flash('error', 'Erro ao carregar conta a pagar');
      res.redirect('/financas/contas-pagar');
    }
  }

  // Editar conta
  async edit(req, res) {
    try {
      const { id } = req.params;
      
      const conta = {
        id: 1,
        numero: 'CP-2024-001',
        fornecedor_id: 1,
        descricao: 'Compra de mercadorias',
        valor_original: 25000.00,
        data_emissao: new Date('2024-01-15'),
        data_vencimento: new Date('2024-02-15'),
        categoria: 'Fornecedores',
        observacoes: 'Pagamento conforme acordo comercial'
      };

      const fornecedores = [
        { id: 1, nome: 'Fornecedor ABC Lda', nuit: '400123456' },
        { id: 2, nome: 'Energia de Moçambique', nuit: '400789123' }
      ];

      const categorias = [
        'Fornecedores',
        'Utilidades',
        'Telecomunicações'
      ];

      res.render('financas/contas-pagar-edit', {
        title: `Editar Conta ${conta.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        conta,
        fornecedores,
        categorias,
        breadcrumbs: [
          { texto: 'Dashboard', link: '/dashboard' },
          { texto: 'Finanças', link: '#' },
          { texto: 'Contas a Pagar', link: '/financas/contas-pagar' },
          { texto: 'Editar', link: '#' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar conta para edição:', error);
      req.flash('error', 'Erro ao carregar conta');
      res.redirect('/financas/contas-pagar');
    }
  }

  // Atualizar conta
  async update(req, res) {
    try {
      const { id } = req.params;
      // Aqui seria a lógica para atualizar a conta
      req.flash('success', 'Conta atualizada com sucesso!');
      res.redirect(`/financas/contas-pagar/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      req.flash('error', 'Erro ao atualizar conta');
      res.redirect(`/financas/contas-pagar/${req.params.id}/edit`);
    }
  }

  // Processar pagamento
  async pagar(req, res) {
    try {
      const { id } = req.params;
      // Aqui seria a lógica para processar o pagamento
      req.flash('success', 'Pagamento processado com sucesso!');
      res.redirect(`/financas/contas-pagar/${id}`);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      req.flash('error', 'Erro ao processar pagamento');
      res.redirect(`/financas/contas-pagar/${req.params.id}`);
    }
  }
}

module.exports = ContasPagarController;