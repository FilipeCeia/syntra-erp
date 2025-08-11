class CaixaController {
  // Dashboard do caixa
  async index(req, res) {
    try {
      // Dados fictícios do caixa
      const caixa = {
        status: 'aberto',
        data_abertura: '2024-01-22 08:00:00',
        usuario_abertura: 'Admin',
        saldo_inicial: 5000.00,
        saldo_atual: 12750.00,
        total_entradas: 8500.00,
        total_saidas: 750.00
      };

      const movimentos = [
        {
          id: 1,
          tipo: 'entrada',
          descricao: 'Recebimento de cliente - Fatura #001',
          valor: 2500.00,
          data: '2024-01-22 09:30:00',
          usuario: 'Admin',
          categoria: 'Vendas'
        },
        {
          id: 2,
          tipo: 'entrada',
          descricao: 'Pagamento à vista',
          valor: 1800.00,
          data: '2024-01-22 10:15:00',
          usuario: 'Admin',
          categoria: 'Vendas'
        },
        {
          id: 3,
          tipo: 'saida',
          descricao: 'Compra de material de escritório',
          valor: 350.00,
          data: '2024-01-22 11:00:00',
          usuario: 'Admin',
          categoria: 'Despesas'
        },
        {
          id: 4,
          tipo: 'entrada',
          descricao: 'Recebimento de duplicata',
          valor: 4200.00,
          data: '2024-01-22 14:20:00',
          usuario: 'Admin',
          categoria: 'Recebimentos'
        },
        {
          id: 5,
          tipo: 'saida',
          descricao: 'Pagamento de fornecedor',
          valor: 400.00,
          data: '2024-01-22 15:45:00',
          usuario: 'Admin',
          categoria: 'Pagamentos'
        }
      ];

      const categorias = [
        'Vendas',
        'Recebimentos',
        'Pagamentos',
        'Despesas',
        'Transferências',
        'Outros'
      ];

      res.render('financas/caixa', {
        title: 'Gestão de Caixa',
        caixa,
        movimentos,
        categorias,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao carregar caixa:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Listar movimentos do caixa
  async movimentos(req, res) {
    try {
      const { data_inicio, data_fim, tipo, categoria } = req.query;
      
      // Dados fictícios de movimentos
      const movimentos = [
        {
          id: 1,
          tipo: 'entrada',
          descricao: 'Recebimento de cliente - Fatura #001',
          valor: 2500.00,
          data: '2024-01-22 09:30:00',
          usuario: 'Admin',
          categoria: 'Vendas'
        },
        {
          id: 2,
          tipo: 'entrada',
          descricao: 'Pagamento à vista',
          valor: 1800.00,
          data: '2024-01-22 10:15:00',
          usuario: 'Admin',
          categoria: 'Vendas'
        },
        {
          id: 3,
          tipo: 'saida',
          descricao: 'Compra de material de escritório',
          valor: 350.00,
          data: '2024-01-22 11:00:00',
          usuario: 'Admin',
          categoria: 'Despesas'
        }
      ];

      const categorias = [
        'Vendas',
        'Recebimentos',
        'Pagamentos',
        'Despesas',
        'Transferências',
        'Outros'
      ];

      res.render('financas/caixa-movimentos', {
        title: 'Movimentos do Caixa',
        movimentos,
        categorias,
        filtros: { data_inicio, data_fim, tipo, categoria },
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao listar movimentos:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Exibir formulário de abertura de caixa
  async abertura(req, res) {
    try {
      res.render('financas/caixa-abertura', {
        title: 'Abertura de Caixa'
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de abertura:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Processar abertura de caixa
  async storeAbertura(req, res) {
    try {
      const { saldo_inicial, observacoes } = req.body;
      
      // Simular abertura do caixa
      console.log('Caixa aberto:', {
        saldo_inicial: parseFloat(saldo_inicial),
        observacoes,
        data_abertura: new Date(),
        usuario: 'Admin'
      });

      req.flash('success', 'Caixa aberto com sucesso!');
      res.redirect('/financas/caixa');
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      req.flash('error', 'Erro ao abrir caixa');
      res.redirect('/financas/caixa/abertura');
    }
  }

  // Exibir formulário de fechamento de caixa
  async fechamento(req, res) {
    try {
      // Dados fictícios do caixa atual
      const caixa = {
        saldo_inicial: 5000.00,
        total_entradas: 8500.00,
        total_saidas: 750.00,
        saldo_calculado: 12750.00
      };

      res.render('financas/caixa-fechamento', {
        title: 'Fechamento de Caixa',
        caixa,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de fechamento:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Processar fechamento de caixa
  async storeFechamento(req, res) {
    try {
      const { saldo_final, observacoes } = req.body;
      
      // Simular fechamento do caixa
      console.log('Caixa fechado:', {
        saldo_final: parseFloat(saldo_final),
        observacoes,
        data_fechamento: new Date(),
        usuario: 'Admin'
      });

      req.flash('success', 'Caixa fechado com sucesso!');
      res.redirect('/financas/caixa');
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      req.flash('error', 'Erro ao fechar caixa');
      res.redirect('/financas/caixa/fechamento');
    }
  }

  // Abrir caixa
  async abrir(req, res) {
    try {
      const { saldo_inicial } = req.body;
      
      // Simular abertura do caixa
      console.log('Caixa aberto com saldo inicial:', parseFloat(saldo_inicial));

      res.json({ success: true, message: 'Caixa aberto com sucesso!' });
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      res.status(500).json({ success: false, message: 'Erro ao abrir caixa' });
    }
  }

  // Fechar caixa
  async fechar(req, res) {
    try {
      const { saldo_final, observacoes } = req.body;
      
      // Simular fechamento do caixa
      console.log('Caixa fechado:', {
        saldo_final: parseFloat(saldo_final),
        observacoes
      });

      res.json({ success: true, message: 'Caixa fechado com sucesso!' });
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      res.status(500).json({ success: false, message: 'Erro ao fechar caixa' });
    }
  }

  // Adicionar entrada
  async entrada(req, res) {
    try {
      const { descricao, valor, categoria } = req.body;
      
      // Simular entrada no caixa
      console.log('Nova entrada no caixa:', {
        descricao,
        valor: parseFloat(valor),
        categoria
      });

      res.json({ success: true, message: 'Entrada registrada com sucesso!' });
    } catch (error) {
      console.error('Erro ao registrar entrada:', error);
      res.status(500).json({ success: false, message: 'Erro ao registrar entrada' });
    }
  }

  // Adicionar saída
  async saida(req, res) {
    try {
      const { descricao, valor, categoria } = req.body;
      
      // Simular saída do caixa
      console.log('Nova saída do caixa:', {
        descricao,
        valor: parseFloat(valor),
        categoria
      });

      res.json({ success: true, message: 'Saída registrada com sucesso!' });
    } catch (error) {
      console.error('Erro ao registrar saída:', error);
      res.status(500).json({ success: false, message: 'Erro ao registrar saída' });
    }
  }

  // Relatório de movimentos
  async relatorio(req, res) {
    try {
      const { data_inicio, data_fim, tipo } = req.query;
      
      // Dados fictícios para o relatório
      const movimentos = [
        {
          data: '2024-01-22',
          tipo: 'entrada',
          descricao: 'Vendas do dia',
          valor: 8500.00,
          categoria: 'Vendas'
        },
        {
          data: '2024-01-22',
          tipo: 'saida',
          descricao: 'Despesas operacionais',
          valor: 750.00,
          categoria: 'Despesas'
        }
      ];

      const resumo = {
        total_entradas: 8500.00,
        total_saidas: 750.00,
        saldo_liquido: 7750.00
      };

      res.render('financas/caixa-relatorio', {
        title: 'Relatório de Caixa',
        movimentos,
        resumo,
        filtros: { data_inicio, data_fim, tipo },
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }
}

module.exports = CaixaController;