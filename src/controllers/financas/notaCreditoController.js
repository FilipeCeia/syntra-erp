class NotaCreditoController {
  // Listar notas de crédito
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const status = req.query.status || 'todos';

      // Dados fictícios
      const notasCredito = [
        {
          id: 1,
          numero: 'NC-2024-001',
          cliente: { nome: 'João Silva', nuit: '123456789' },
          motivo: 'Devolução de mercadoria',
          valor_original: 12000.00,
          valor_credito: 12000.00,
          data_emissao: '2024-01-10',
          status: 'aplicada',
          data_aplicacao: '2024-01-12',
          observacoes: 'Produto com defeito'
        },
        {
          id: 2,
          numero: 'NC-2024-002',
          cliente: { nome: 'Maria Santos', nuit: '987654321' },
          motivo: 'Desconto promocional',
          valor_original: 5000.00,
          valor_credito: 1000.00,
          data_emissao: '2024-01-15',
          status: 'pendente',
          observacoes: 'Promoção de fidelidade'
        }
      ];

      const totalItems = notasCredito.length;
      const totalPages = Math.ceil(totalItems / limit);

      res.render('financas/notas-credito', {
        title: 'Notas de Crédito',
        notasCredito,
        currentPage: page,
        totalPages,
        status,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao listar notas de crédito:', error);
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
        'Devolução de mercadoria',
        'Desconto promocional',
        'Erro de faturação',
        'Cancelamento de serviço',
        'Outros'
      ];

      res.render('financas/notas-credito-create', {
        title: 'Nova Nota de Crédito',
        clientes,
        motivos
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de nota de crédito:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Processar criação
  async store(req, res) {
    try {
      const { cliente_id, motivo, valor_credito, observacoes } = req.body;
      
      // Simular criação
      console.log('Nova nota de crédito criada:', {
        cliente_id,
        motivo,
        valor_credito: parseFloat(valor_credito),
        observacoes
      });

      req.flash('success', 'Nota de crédito criada com sucesso!');
      res.redirect('/financas/notas-credito');
    } catch (error) {
      console.error('Erro ao criar nota de crédito:', error);
      req.flash('error', 'Erro ao criar nota de crédito');
      res.redirect('/financas/notas-credito/create');
    }
  }

  // Exibir detalhes
  async show(req, res) {
    try {
      const { id } = req.params;
      
      // Dados fictícios
      const notaCredito = {
        id: parseInt(id),
        numero: `NC-2024-${id.padStart(3, '0')}`,
        cliente: { nome: 'João Silva', nuit: '123456789', email: 'joao@email.com' },
        motivo: 'Devolução de mercadoria',
        valor_original: 12000.00,
        valor_credito: 12000.00,
        data_emissao: '2024-01-10',
        status: 'pendente',
        observacoes: 'Produto com defeito',
        historico: [
          { data: '2024-01-10', acao: 'Nota criada', usuario: 'Admin' },
          { data: '2024-01-11', acao: 'Enviada ao cliente', usuario: 'Admin' }
        ]
      };

      res.render('financas/notas-credito-show', {
        title: `Nota de Crédito ${notaCredito.numero}`,
        notaCredito,
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao exibir nota de crédito:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Exibir formulário de edição
  async edit(req, res) {
    try {
      const { id } = req.params;
      
      // Dados fictícios da nota de crédito
      const notaCredito = {
        id: parseInt(id),
        numero: `NC-2024-${id.padStart(3, '0')}`,
        cliente_id: 1,
        motivo: 'Devolução de mercadoria',
        valor_credito: 12000.00,
        observacoes: 'Produto com defeito'
      };

      // Dados fictícios para o formulário
      const clientes = [
        { id: 1, nome: 'João Silva', nuit: '123456789' },
        { id: 2, nome: 'Maria Santos', nuit: '987654321' },
        { id: 3, nome: 'Carlos Mendes', nuit: '456789123' }
      ];

      const motivos = [
        'Devolução de mercadoria',
        'Desconto promocional',
        'Erro de faturação',
        'Cancelamento de serviço',
        'Outros'
      ];

      res.render('financas/notas-credito-edit', {
        title: `Editar Nota de Crédito ${notaCredito.numero}`,
        notaCredito,
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
      const { cliente_id, motivo, valor_credito, observacoes } = req.body;
      
      // Simular atualização
      console.log(`Nota de crédito ${id} atualizada:`, {
        cliente_id,
        motivo,
        valor_credito: parseFloat(valor_credito),
        observacoes
      });

      req.flash('success', 'Nota de crédito atualizada com sucesso!');
      res.redirect(`/financas/notas-credito/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar nota de crédito:', error);
      req.flash('error', 'Erro ao atualizar nota de crédito');
      res.redirect(`/financas/notas-credito/${id}/edit`);
    }
  }

  // Aplicar nota de crédito
  async aplicar(req, res) {
    try {
      const { id } = req.params;
      
      // Simular aplicação
      console.log(`Nota de crédito ${id} aplicada`);

      res.json({ success: true, message: 'Nota de crédito aplicada com sucesso!' });
    } catch (error) {
      console.error('Erro ao aplicar nota de crédito:', error);
      res.status(500).json({ success: false, message: 'Erro ao aplicar nota de crédito' });
    }
  }
}

module.exports = NotaCreditoController;