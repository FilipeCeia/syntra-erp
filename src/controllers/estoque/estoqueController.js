class EstoqueController {
  // Resumo do estoque
  async resumo(req, res) {
    try {
      // Dados fictícios para o resumo de estoque
      const resumoEstoque = {
        total_produtos: 1247,
        valor_total: 2845392.50,
        produtos_baixo_estoque: 23,
        produtos_sem_estoque: 8,
        movimentacoes_hoje: 45,
        valor_movimentacoes_hoje: 125430.75
      };

      // Produtos com baixo estoque
      const produtosBaixoEstoque = [
        {
          id: 1,
          codigo: 'PROD001',
          nome: 'Laptop Dell Inspiron 15',
          categoria: 'Informática',
          estoque_atual: 3,
          estoque_minimo: 10,
          preco_venda: 45000.00,
          status: 'critico'
        },
        {
          id: 2,
          codigo: 'PROD002',
          nome: 'Mouse Wireless Logitech',
          categoria: 'Acessórios',
          estoque_atual: 5,
          estoque_minimo: 15,
          preco_venda: 850.00,
          status: 'baixo'
        },
        {
          id: 3,
          codigo: 'PROD003',
          nome: 'Teclado Mecânico RGB',
          categoria: 'Acessórios',
          estoque_atual: 0,
          estoque_minimo: 8,
          preco_venda: 2500.00,
          status: 'sem_estoque'
        }
      ];

      // Movimentações recentes
      const movimentacoesRecentes = [
        {
          id: 1,
          tipo: 'entrada',
          produto: 'Smartphone Samsung Galaxy',
          quantidade: 15,
          data: new Date('2024-01-15'),
          usuario: 'João Silva',
          observacao: 'Compra - Fornecedor Tech Solutions'
        },
        {
          id: 2,
          tipo: 'saida',
          produto: 'Impressora HP LaserJet',
          quantidade: 2,
          data: new Date('2024-01-15'),
          usuario: 'Maria Santos',
          observacao: 'Venda - Cliente ABC Lda'
        },
        {
          id: 3,
          tipo: 'transferencia',
          produto: 'Monitor LED 24"',
          quantidade: 5,
          data: new Date('2024-01-14'),
          usuario: 'Carlos Mendes',
          observacao: 'Transferência: Loja Centro → Loja Matola'
        }
      ];

      // Estoque por categoria
      const categoriasEstoque = [
        { categoria: 'Smartphones', quantidade: 234, valor: 1247000.00, percentual: 43.8 },
        { categoria: 'Informática', quantidade: 156, valor: 890000.00, percentual: 31.3 },
        { categoria: 'Equipamentos', quantidade: 89, valor: 450000.00, percentual: 15.8 },
        { categoria: 'Acessórios', quantidade: 234, valor: 257392.50, percentual: 9.1 }
      ];

      res.render('estoque/resumo', {
        title: 'Resumo de Estoque - SYNTRA ERP',
        layout: 'layouts/main',
        resumoEstoque,
        produtosBaixoEstoque,
        movimentacoesRecentes,
        categoriasEstoque
      });
    } catch (error) {
      console.error('Erro ao carregar resumo de estoque:', error);
      req.flash('error', 'Erro ao carregar resumo de estoque');
      res.redirect('/dashboard');
    }
  }

  // Listar movimentações
  async movimentacoes(req, res) {
    try {
      const { page = 1, limit = 20, search = '', tipo = '', data_inicio = '', data_fim = '' } = req.query;

      // Dados fictícios para movimentações
      const movimentacoes = [
        {
          id: 1,
          tipo: 'entrada',
          produto: {
            codigo: 'PROD001',
            nome: 'Laptop Dell Inspiron 15',
            categoria: 'Informática'
          },
          quantidade: 10,
          preco_unitario: 42000.00,
          valor_total: 420000.00,
          data: new Date('2024-01-15T10:30:00'),
          usuario: 'João Silva',
          documento: 'COMP-2024-001',
          observacao: 'Compra de mercadoria - Fornecedor Tech Solutions'
        },
        {
          id: 2,
          tipo: 'saida',
          produto: {
            codigo: 'PROD002',
            nome: 'Mouse Wireless Logitech',
            categoria: 'Acessórios'
          },
          quantidade: 5,
          preco_unitario: 850.00,
          valor_total: 4250.00,
          data: new Date('2024-01-15T14:20:00'),
          usuario: 'Maria Santos',
          documento: 'VEND-2024-045',
          observacao: 'Venda ao cliente - ABC Construções Lda'
        },
        {
          id: 3,
          tipo: 'transferencia_saida',
          produto: {
            codigo: 'PROD003',
            nome: 'Monitor LED 24"',
            categoria: 'Informática'
          },
          quantidade: 3,
          preco_unitario: 8500.00,
          valor_total: 25500.00,
          data: new Date('2024-01-14T16:45:00'),
          usuario: 'Carlos Mendes',
          documento: 'TRANS-2024-012',
          observacao: 'Transferência para Loja Matola'
        },
        {
          id: 4,
          tipo: 'ajuste',
          produto: {
            codigo: 'PROD004',
            nome: 'Teclado Mecânico RGB',
            categoria: 'Acessórios'
          },
          quantidade: -2,
          preco_unitario: 2500.00,
          valor_total: -5000.00,
          data: new Date('2024-01-14T09:15:00'),
          usuario: 'Ana Costa',
          documento: 'AJUST-2024-003',
          observacao: 'Ajuste de inventário - produto danificado'
        }
      ];

      const totalMovimentacoes = 156;
      const totalPages = Math.ceil(totalMovimentacoes / limit);

      res.render('estoque/movimentacoes', {
        title: 'Movimentações de Estoque - SYNTRA ERP',
        layout: 'layouts/main',
        movimentacoes,
        currentPage: parseInt(page),
        totalPages,
        search,
        tipo,
        data_inicio,
        data_fim
      });
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
      req.flash('error', 'Erro ao carregar movimentações de estoque');
      res.redirect('/estoque/resumo');
    }
  }

  // Controlo de inventário
  async inventario(req, res) {
    try {
      const { page = 1, limit = 20, search = '', categoria = '', status = '' } = req.query;

      // Dados fictícios para inventário
      const inventario = [
        {
          id: 1,
          produto: {
            codigo: 'PROD001',
            nome: 'Laptop Dell Inspiron 15',
            categoria: 'Informática'
          },
          estoque_sistema: 25,
          estoque_fisico: 23,
          diferenca: -2,
          valor_unitario: 42000.00,
          valor_diferenca: -84000.00,
          data_contagem: new Date('2024-01-10'),
          status: 'divergencia',
          observacao: '2 unidades não localizadas no armazém'
        },
        {
          id: 2,
          produto: {
            codigo: 'PROD002',
            nome: 'Mouse Wireless Logitech',
            categoria: 'Acessórios'
          },
          estoque_sistema: 50,
          estoque_fisico: 50,
          diferenca: 0,
          valor_unitario: 850.00,
          valor_diferenca: 0.00,
          data_contagem: new Date('2024-01-10'),
          status: 'conferido',
          observacao: 'Estoque conferido e correto'
        },
        {
          id: 3,
          produto: {
            codigo: 'PROD003',
            nome: 'Monitor LED 24"',
            categoria: 'Informática'
          },
          estoque_sistema: 15,
          estoque_fisico: 17,
          diferenca: 2,
          valor_unitario: 8500.00,
          valor_diferenca: 17000.00,
          data_contagem: new Date('2024-01-09'),
          status: 'divergencia',
          observacao: '2 unidades extras encontradas'
        }
      ];

      const totalInventario = 1247;
      const totalPages = Math.ceil(totalInventario / limit);

      // Resumo do inventário
      const resumoInventario = {
        total_produtos: 1247,
        produtos_conferidos: 1156,
        produtos_divergencia: 91,
        valor_total_divergencia: 125430.50,
        percentual_conferido: 92.7
      };

      res.render('estoque/inventario', {
        title: 'Controlo de Inventário - SYNTRA ERP',
        layout: 'layouts/main',
        inventario,
        resumoInventario,
        currentPage: parseInt(page),
        totalPages,
        search,
        categoria,
        status
      });
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
      req.flash('error', 'Erro ao carregar controlo de inventário');
      res.redirect('/estoque/resumo');
    }
  }
}

module.exports = EstoqueController;