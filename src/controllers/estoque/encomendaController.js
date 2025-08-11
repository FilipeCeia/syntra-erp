class EncomendaController {
  // Listar encomendas
  async index(req, res) {
    try {
      const { page = 1, limit = 20, search = '', status = '', fornecedor = '' } = req.query;

      // Dados fictícios para encomendas
      const encomendas = [
        {
          id: 1,
          numero: 'ENC-2024-001',
          fornecedor: {
            id: 1,
            nome: 'Tech Solutions Lda',
            nuit: '400234567'
          },
          data_criacao: new Date('2024-01-15'),
          data_entrega_prevista: new Date('2024-01-25'),
          data_entrega_real: null,
          status: 'pendente',
          total_itens: 25,
          valor_total: 450000.00,
          usuario_criacao: 'João Silva',
          observacao: 'Encomenda urgente para reposição de estoque'
        },
        {
          id: 2,
          numero: 'ENC-2024-002',
          fornecedor: {
            id: 2,
            nome: 'Distribuidora XYZ',
            nuit: '400345678'
          },
          data_criacao: new Date('2024-01-12'),
          data_entrega_prevista: new Date('2024-01-22'),
          data_entrega_real: new Date('2024-01-20'),
          status: 'entregue',
          total_itens: 15,
          valor_total: 125000.00,
          usuario_criacao: 'Maria Santos',
          observacao: 'Produtos para nova linha de vendas'
        }
      ];

      const totalEncomendas = 34;
      const totalPages = Math.ceil(totalEncomendas / limit);

      // Lista de fornecedores para filtros
      const fornecedores = [
        { id: 1, nome: 'Tech Solutions Lda', nuit: '400234567' },
        { id: 2, nome: 'Distribuidora XYZ', nuit: '400345678' },
        { id: 3, nome: 'Office Supply Moz', nuit: '400456789' },
        { id: 4, nome: 'Eletrônicos Maputo', nuit: '400567890' }
      ];

      res.render('estoque/encomendas', {
        title: 'Notas de Encomenda - SYNTRA ERP',
        layout: 'layouts/main',
        encomendas,
        fornecedores,
        currentPage: parseInt(page),
        totalPages,
        search,
        status,
        fornecedor
      });
    } catch (error) {
      console.error('Erro ao carregar encomendas:', error);
      req.flash('error', 'Erro ao carregar encomendas');
      res.redirect('/estoque/resumo');
    }
  }

  // Formulário para nova encomenda
  async create(req, res) {
    try {
      // Lista de fornecedores
      const fornecedores = [
        {
          id: 1,
          nome: 'Tech Solutions Lda',
          nuit: '400234567',
          email: 'vendas@techsolutions.co.mz',
          telefone: '+258 21 123456'
        },
        {
          id: 2,
          nome: 'Distribuidora XYZ',
          nuit: '400345678',
          email: 'comercial@distribuidoraxyz.co.mz',
          telefone: '+258 21 654321'
        },
        {
          id: 3,
          nome: 'Office Supply Moz',
          nuit: '400456789',
          email: 'info@officesupply.co.mz',
          telefone: '+258 21 987654'
        }
      ];

      // Lista de produtos disponíveis para encomenda
      const produtos = [
        {
          id: 1,
          codigo: 'PROD001',
          nome: 'Laptop Dell Inspiron 15',
          categoria: 'Informática',
          preco_compra: 38000.00,
          estoque_atual: 5,
          estoque_minimo: 15
        },
        {
          id: 2,
          codigo: 'PROD002',
          nome: 'Mouse Wireless Logitech',
          categoria: 'Acessórios',
          preco_compra: 650.00,
          estoque_atual: 12,
          estoque_minimo: 25
        },
        {
          id: 3,
          codigo: 'PROD003',
          nome: 'Teclado Mecânico RGB',
          categoria: 'Acessórios',
          preco_compra: 1800.00,
          estoque_atual: 0,
          estoque_minimo: 10
        },
        {
          id: 4,
          codigo: 'PROD004',
          nome: 'Monitor LED 27"',
          categoria: 'Informática',
          preco_compra: 11500.00,
          estoque_atual: 2,
          estoque_minimo: 8
        }
      ];

      res.render('estoque/encomendas-create', {
        title: 'Nova Encomenda - SYNTRA ERP',
        layout: 'layouts/main',
        fornecedores,
        produtos
      });
    } catch (error) {
      console.error('Erro ao carregar formulário de encomenda:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/estoque/encomendas');
    }
  }

  // Criar nova encomenda
  async store(req, res) {
    try {
      const { fornecedor_id, data_entrega_prevista, observacao, itens } = req.body;

      // Simular criação da encomenda
      const novaEncomenda = {
        numero: `ENC-2024-${String(Date.now()).slice(-3)}`,
        fornecedor_id,
        data_entrega_prevista,
        observacao,
        itens: JSON.parse(itens),
        data_criacao: new Date(),
        status: 'pendente',
        usuario_criacao: req.user.nome
      };

      req.flash('success', `Encomenda ${novaEncomenda.numero} criada com sucesso!`);
      res.redirect('/estoque/encomendas');
    } catch (error) {
      console.error('Erro ao criar encomenda:', error);
      req.flash('error', 'Erro ao criar encomenda');
      res.redirect('/estoque/encomendas/create');
    }
  }

  // Exibir detalhes da encomenda
  async show(req, res) {
    try {
      const { id } = req.params;

      // Dados fictícios para uma encomenda específica
      const encomenda = {
        id: parseInt(id),
        numero: 'ENC-2024-001',
        fornecedor: {
          id: 1,
          nome: 'Tech Solutions Lda',
          nuit: '400234567',
          email: 'vendas@techsolutions.co.mz',
          telefone: '+258 21 123456',
          endereco: 'Av. Julius Nyerere, 1234, Maputo'
        },
        data_criacao: new Date('2024-01-15T10:30:00'),
        data_entrega_prevista: new Date('2024-01-25'),
        data_entrega_real: null,
        status: 'pendente',
        usuario_criacao: 'João Silva',
        observacao: 'Encomenda urgente para reposição de estoque de produtos em falta',
        itens: [
          {
            id: 1,
            produto: {
              codigo: 'PROD001',
              nome: 'Laptop Dell Inspiron 15',
              categoria: 'Informática'
            },
            quantidade: 10,
            preco_unitario: 38000.00,
            valor_total: 380000.00
          },
          {
            id: 2,
            produto: {
              codigo: 'PROD003',
              nome: 'Teclado Mecânico RGB',
              categoria: 'Acessórios'
            },
            quantidade: 15,
            preco_unitario: 1800.00,
            valor_total: 27000.00
          },
          {
            id: 3,
            produto: {
              codigo: 'PROD004',
              nome: 'Monitor LED 27"',
              categoria: 'Informática'
            },
            quantidade: 5,
            preco_unitario: 11500.00,
            valor_total: 57500.00
          }
        ],
        total_itens: 30,
        subtotal: 464500.00,
        iva: 74320.00,
        valor_total: 538820.00
      };

      res.render('estoque/encomendas-show', {
        title: `Encomenda #${encomenda.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        encomenda
      });
    } catch (error) {
      console.error('Erro ao carregar encomenda:', error);
      req.flash('error', 'Erro ao carregar encomenda');
      res.redirect('/estoque/encomendas');
    }
  }
}

module.exports = EncomendaController;