class FinancasController {
  // Dashboard financeiro


    // Dashboard financeiro
  async dashboard(req, res) {
    try {
      // Dados fictícios para o dashboard
      const resumoFinanceiro = {
        saldo_atual: 125000.00,
        contasReceber: {
          total: 45000.00,
          vencidas: 12000.00,
          vencendo: 8000.00,
          em_dia: 25000.00
        },
        contasPagar: {
          total: 28000.00,
          vencidas: 5000.00,
          vencendo: 10000.00,
          em_dia: 13000.00
        },
        saldoCaixa: 15000.00,
        saldoBancos: 110000.00,
        fluxoDiario: {
          entradas: 25000.00,
          saidas: 18000.00,
          saldo: 7000.00
        },
        fluxo_mensal: 17000.00
      };

            const movimentosRecentes = [
        {
          tipo: 'entrada',
          descricao: 'Recebimento - Fatura #001',
          valor: 5000.00,
          data: new Date('2024-01-22')
        },
        {
          tipo: 'saida',
          descricao: 'Pagamento - Fornecedor ABC',
          valor: 3200.00,
          data: new Date('2024-01-22')
        },
        {
          tipo: 'entrada',
          descricao: 'Venda à vista',
          valor: 1800.00,
          data: new Date('2024-01-21')
        }
      ];
      

      const alertas = [
        {
          tipo: 'warning',
          mensagem: '5 contas a pagar vencem esta semana',
          link: '/financas/contas-pagar?status=vencendo'
        },
        {
          tipo: 'info',
          mensagem: '3 contas a receber em atraso',
          link: '/financas/contas-receber?status=vencida'
        }
      ];

      const breadcrumbs = [
        { texto: 'Início', link: '/dashboard' },
        { texto: 'Finanças', link: '/financas/dashboard' },
        { texto: 'Dashboard', link: '' }
      ];

      res.render('financas/dashboard', {
        title: 'Dashboard Financeiro',
        breadcrumbs,
        resumoFinanceiro,
        movimentosRecentes,
        alertas,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard financeiro:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

    // Fluxo de caixa
  async fluxoCaixa(req, res) {
    try {
      const entradas = [
        { 
          descricao: 'Vendas', 
          valor: 45000.00, 
          categoria: 'Receitas',
          data: new Date('2024-01-22') // Adicionado
        },
        { 
          descricao: 'Recebimentos', 
          valor: 25000.00, 
          categoria: 'Recebimentos',
          data: new Date('2024-01-21') // Adicionado
        },
        { 
          descricao: 'Outros', 
          valor: 15000.00, 
          categoria: 'Diversos',
          data: new Date('2024-01-20') // Adicionado
        }
      ];

      const saidas = [
        { 
          descricao: 'Fornecedores', 
          valor: 30000.00, 
          categoria: 'Compras',
          data: new Date('2024-01-22') // Adicionado
        },
        { 
          descricao: 'Salários', 
          valor: 15000.00, 
          categoria: 'Pessoal',
          data: new Date('2024-01-21') // Adicionado
        },
        { 
          descricao: 'Despesas', 
          valor: 15000.00, 
          categoria: 'Operacionais',
          data: new Date('2024-01-20') // Adicionado
        }
      ];

      // Dados fictícios do fluxo de caixa
      const fluxoCaixa = {
        saldo_inicial: 50000.00,
        total_entradas: 85000.00,
        total_saidas: 60000.00,
        saldo_final: 75000.00,
        entradas: entradas,
        saidas: saidas
      };

      const breadcrumbs = [
        { texto: 'Início', link: '/dashboard' },
        { texto: 'Finanças', link: '/financas/dashboard' },
        { texto: 'Fluxo de Caixa', link: '' }
      ];

      res.render('financas/fluxo-caixa', {
        title: 'Fluxo de Caixa',
        breadcrumbs,
        fluxoCaixa,
        entradas,
        saidas,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao carregar fluxo de caixa:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Projeção do fluxo de caixa
  async projecaoFluxo(req, res) {
    try {
      // Dados fictícios para projeção
      const projecoes = [
        {
          periodo: 'Janeiro 2024',
          entradas_previstas: 120000.00,
          saidas_previstas: 95000.00,
          saldo_projetado: 25000.00
        },
        {
          periodo: 'Fevereiro 2024',
          entradas_previstas: 135000.00,
          saidas_previstas: 105000.00,
          saldo_projetado: 30000.00
        },
        {
          periodo: 'Março 2024',
          entradas_previstas: 150000.00,
          saidas_previstas: 115000.00,
          saldo_projetado: 35000.00
        }
      ];

      const breadcrumbs = [
        { texto: 'Início', link: '/dashboard' },
        { texto: 'Finanças', link: '/financas/dashboard' },
        { texto: 'Fluxo de Caixa', link: '/financas/fluxo-caixa' },
        { texto: 'Projeção', link: '' }
      ];

      res.render('financas/projecao-fluxo', {
        title: 'Projeção do Fluxo de Caixa',
        breadcrumbs,
        projecoes,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao carregar projeção do fluxo:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Reconciliação bancária
  async reconciliacao(req, res) {
    try {
      // Dados fictícios para reconciliação
      const extratosBanco = [
        {
          data: '2024-01-22',
          descricao: 'Depósito Cliente ABC',
          valor: 15000.00,
          tipo: 'credito',
          conciliado: false
        },
        {
          data: '2024-01-21',
          descricao: 'TPA - Venda 001',
          valor: 8500.00,
          tipo: 'credito',
          conciliado: true
        },
        {
          data: '2024-01-20',
          descricao: 'Pagamento Fornecedor XYZ',
          valor: 12000.00,
          tipo: 'debito',
          conciliado: false
        }
      ];

      const movimentosERP = [
        {
          data: '2024-01-22',
          descricao: 'Recebimento - Fatura #001',
          valor: 15000.00,
          tipo: 'entrada'
        },
        {
          data: '2024-01-21',
          descricao: 'Venda POS #001',
          valor: 8500.00,
          tipo: 'entrada'
        },
        {
          data: '2024-01-20',
          descricao: 'Pagamento - Fornecedor XYZ',
          valor: 12000.00,
          tipo: 'saida'
        }
      ];

      const breadcrumbs = [
        { texto: 'Início', link: '/dashboard' },
        { texto: 'Finanças', link: '/financas/dashboard' },
        { texto: 'Reconciliação Bancária', link: '' }
      ];

      res.render('financas/reconciliacao', {
        title: 'Reconciliação Bancária',
        breadcrumbs,
        extratosBanco,
        movimentosERP,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao carregar reconciliação:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Processar reconciliação
  async processarReconciliacao(req, res) {
    try {
      const { movimentos_selecionados } = req.body;
      
      // Simular processamento da reconciliação
      console.log('Processando reconciliação para movimentos:', movimentos_selecionados);
      
      res.json({
        success: true,
        message: 'Reconciliação processada com sucesso',
        movimentos_conciliados: movimentos_selecionados?.length || 0
      });
    } catch (error) {
      console.error('Erro ao processar reconciliação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar reconciliação'
      });
    }
  }

  // Gestão de bancos
  async bancos(req, res) {
    try {
      // Dados fictícios dos bancos
      const bancos = [
        {
          id: 1,
          nome: 'Banco Comercial e de Investimentos',
          codigo: 'BCI',
          conta: '1234567890',
          saldo: 125000.00,
          ativo: true
        },
        {
          id: 2,
          nome: 'Standard Bank',
          codigo: 'SB',
          conta: '0987654321',
          saldo: 85000.00,
          ativo: true
        },
        {
          id: 3,
          nome: 'Millennium BIM',
          codigo: 'BIM',
          conta: '1122334455',
          saldo: 45000.00,
          ativo: false
        }
      ];

      const breadcrumbs = [
        { texto: 'Início', link: '/dashboard' },
        { texto: 'Finanças', link: '/financas/dashboard' },
        { texto: 'Gestão de Bancos', link: '' }
      ];

      res.render('financas/bancos', {
        title: 'Gestão de Bancos',
        breadcrumbs,
        bancos,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao carregar bancos:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Criar novo banco
  async createBanco(req, res) {
    try {
      const breadcrumbs = [
        { texto: 'Início', link: '/dashboard' },
        { texto: 'Finanças', link: '/financas/dashboard' },
        { texto: 'Gestão de Bancos', link: '/financas/bancos' },
        { texto: 'Novo Banco', link: '' }
      ];

      res.render('financas/banco-form', {
        title: 'Novo Banco',
        breadcrumbs,
        banco: {},
        action: '/financas/bancos',
        method: 'POST'
      });
    } catch (error) {
      console.error('Erro ao carregar formulário de banco:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Salvar banco
  async storeBanco(req, res) {
    try {
      const { nome, codigo, conta, saldo_inicial } = req.body;
      
      // Simular salvamento do banco
      console.log('Salvando banco:', { nome, codigo, conta, saldo_inicial });
      
      res.redirect('/financas/bancos');
    } catch (error) {
      console.error('Erro ao salvar banco:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Extratos do banco
  async extratosBanco(req, res) {
    try {
      const { id } = req.params;
      
      // Dados fictícios do extrato
      const banco = {
        id: id,
        nome: 'Banco Comercial e de Investimentos',
        conta: '1234567890',
        saldo: 125000.00
      };

      const extratos = [
        {
          data: '2024-01-22',
          descricao: 'Depósito Cliente ABC',
          valor: 15000.00,
          tipo: 'credito',
          saldo: 125000.00
        },
        {
          data: '2024-01-21',
          descricao: 'TPA - Venda 001',
          valor: 8500.00,
          tipo: 'credito',
          saldo: 110000.00
        },
        {
          data: '2024-01-20',
          descricao: 'Pagamento Fornecedor XYZ',
          valor: 12000.00,
          tipo: 'debito',
          saldo: 101500.00
        }
      ];

      const breadcrumbs = [
        { texto: 'Início', link: '/dashboard' },
        { texto: 'Finanças', link: '/financas/dashboard' },
        { texto: 'Gestão de Bancos', link: '/financas/bancos' },
        { texto: `Extratos - ${banco.nome}`, link: '' }
      ];

      res.render('financas/banco-extratos', {
        title: `Extratos - ${banco.nome}`,
        breadcrumbs,
        banco,
        extratos,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao carregar extratos do banco:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }
}

//fluxoCai

module.exports = FinancasController;