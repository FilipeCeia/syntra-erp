class NotaDebitoController {
  // Listar notas de débito
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const status = req.query.status || 'todos';

      // Dados fictícios
      const notasDebito = [
        {
          id: 1,
          numero: 'ND-2024-001',
          cliente: { nome: 'João Silva', nuit: '123456789' },
          motivo: 'Juros por atraso no pagamento',
          valor_original: 15000.00,
          valor_juros: 750.00,
          valor_total: 15750.00,
          data_emissao: '2024-01-15',
          data_vencimento: '2024-02-15',
          status: 'pendente',
          observacoes: 'Cobrança de juros conforme contrato'
        },
        {
          id: 2,
          numero: 'ND-2024-002',
          cliente: { nome: 'Maria Santos', nuit: '987654321' },
          motivo: 'Correção de valor de fatura',
          valor_original: 8500.00,
          valor_correcao: 1500.00,
          valor_total: 10000.00,
          data_emissao: '2024-01-20',
          data_vencimento: '2024-02-20',
          status: 'paga',
          data_pagamento: '2024-02-18',
          observacoes: 'Diferença de preço identificada'
        }
      ];

      const totalItems = notasDebito.length;
      const totalPages = Math.ceil(totalItems / limit);

      res.render('financas/notas-debito', {
        title: 'Notas de Débito',
        notasDebito,
        currentPage: page,
        totalPages,
        status,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao listar notas de débito:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Exibir formulário de criação
  async create(req, res) {
    try {
      // Dados fictícios para o formulário
      const clientes = [
        { id: 1, nome: 'João Silva', nuit: '123456789' },
        { id: 2, nome: 'Maria Santos', nuit: '987654321' },
        { id: 3, nome: 'Carlos Mendes', nuit: '456789123' }
      ];

      const motivos = [
        'Juros por atraso no pagamento',
        'Correção de valor de fatura',
        'Multa contratual',
        'Despesas administrativas',
        'Outros'
      ];

      res.render('financas/notas-debito-create', {
        title: 'Nova Nota de Débito',
        clientes,
        motivos
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de nota de débito:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Processar criação
  async store(req, res) {
    try {
      const { cliente_id, motivo, valor_original, valor_adicional, data_vencimento, observacoes } = req.body;
      
      // Simular criação
      console.log('Nova nota de débito criada:', {
        cliente_id,
        motivo,
        valor_original: parseFloat(valor_original),
        valor_adicional: parseFloat(valor_adicional),
        valor_total: parseFloat(valor_original) + parseFloat(valor_adicional),
        data_vencimento,
        observacoes
      });

      req.flash('success', 'Nota de débito criada com sucesso!');
      res.redirect('/financas/notas-debito');
    } catch (error) {
      console.error('Erro ao criar nota de débito:', error);
      req.flash('error', 'Erro ao criar nota de débito');
      res.redirect('/financas/notas-debito/create');
    }
  }


   async show(req, res) {
    try {
      const { id } = req.params;
      
      // Dados fictícios
      const notaDebito = {
        id: parseInt(id),
        numero: `ND-2024-${id.padStart(3, '0')}`,
        cliente: { nome: 'João Silva', nuit: '123456789', email: 'joao@email.com' },
        motivo: 'Juros por atraso no pagamento',
        valor_original: 15000.00,
        valor_juros: 750.00,
        valor_total: 15750.00,
        data_emissao: '2024-01-15',
        data_vencimento: '2024-02-15',
        status: 'pendente',
        observacoes: 'Cobrança de juros conforme contrato',
        historico: [
          { data: '2024-01-15', acao: 'Nota criada', usuario: 'Admin' },
          { data: '2024-01-16', acao: 'Enviada ao cliente', usuario: 'Admin' }
        ]
      };

      res.render('financas/notas-debito-show', {
        title: `Nota de Débito ${notaDebito.numero}`,
        notaDebito,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao exibir nota de débito:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Exibir formulário de edição
  async edit(req, res) {
    try {
      const { id } = req.params;
      
      // Dados fictícios da nota de débito
      const notaDebito = {
        id: parseInt(id),
        numero: `ND-2024-${id.padStart(3, '0')}`,
        cliente_id: 1,
        motivo: 'Juros por atraso no pagamento',
        valor_original: 15000.00,
        valor_adicional: 750.00,
        data_vencimento: '2024-02-15',
        observacoes: 'Cobrança de juros conforme contrato'
      };

      // Dados fictícios para o formulário
      const clientes = [
        { id: 1, nome: 'João Silva', nuit: '123456789' },
        { id: 2, nome: 'Maria Santos', nuit: '987654321' },
        { id: 3, nome: 'Carlos Mendes', nuit: '456789123' }
      ];

      const motivos = [
        'Juros por atraso no pagamento',
        'Correção de valor de fatura',
        'Multa contratual',
        'Despesas administrativas',
        'Outros'
      ];

      res.render('financas/notas-debito-edit', {
        title: `Editar Nota de Débito ${notaDebito.numero}`,
        notaDebito,
        clientes,
        motivos
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de edição:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Processar atualização
  async update(req, res) {
    try {
      const { id } = req.params;
      const { cliente_id, motivo, valor_original, valor_adicional, data_vencimento, observacoes } = req.body;
      
      // Simular atualização
      console.log(`Nota de débito ${id} atualizada:`, {
        cliente_id,
        motivo,
        valor_original: parseFloat(valor_original),
        valor_adicional: parseFloat(valor_adicional),
        valor_total: parseFloat(valor_original) + parseFloat(valor_adicional),
        data_vencimento,
        observacoes
      });

      req.flash('success', 'Nota de débito atualizada com sucesso!');
      res.redirect(`/financas/notas-debito/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar nota de débito:', error);
      req.flash('error', 'Erro ao atualizar nota de débito');
      res.redirect(`/financas/notas-debito/${id}/edit`);
    }
  }
}

module.exports = NotaDebitoController;