class TransferenciaController {
  // Listar transferências
  async index(req, res) {
    try {
      const { page = 1, limit = 20, search = '', status = '', loja_origem = '', loja_destino = '' } = req.query;

      // Dados fictícios para transferências
      const transferencias = [
        {
          id: 1,
          numero: 'TRANS-2024-001',
          loja_origem: {
            id: 1,
            nome: 'Loja Centro',
            codigo: 'LC001'
          },
          loja_destino: {
            id: 2,
            nome: 'Loja Matola',
            codigo: 'LM002'
          },
          data_criacao: new Date('2024-01-15'),
          data_envio: new Date('2024-01-15'),
          data_recebimento: new Date('2024-01-16'),
          status: 'concluida',
          total_itens: 15,
          valor_total: 125000.00,
          usuario_criacao: 'João Silva',
          usuario_envio: 'Maria Santos',
          usuario_recebimento: 'Carlos Mendes',
          observacao: 'Transferência de produtos em excesso'
        },
        {
          id: 2,
          numero: 'TRANS-2024-002',
          loja_origem: {
            id: 2,
            nome: 'Loja Matola',
            codigo: 'LM002'
          },
          loja_destino: {
            id: 3,
            nome: 'Loja Beira',
            codigo: 'LB003'
          },
          data_criacao: new Date('2024-01-14'),
          data_envio: new Date('2024-01-14'),
          data_recebimento: null,
          status: 'em_transito',
          total_itens: 8,
          valor_total: 67500.00,
          usuario_criacao: 'Ana Costa',
          usuario_envio: 'Pedro Oliveira',
          usuario_recebimento: null,
          observacao: 'Produtos solicitados pela filial'
        },
        {
          id: 3,
          numero: 'TRANS-2024-003',
          loja_origem: {
            id: 1,
            nome: 'Loja Centro',
            codigo: 'LC001'
          },
          loja_destino: {
            id: 4,
            nome: 'Loja Nampula',
            codigo: 'LN004'
          },
          data_criacao: new Date('2024-01-13'),
          data_envio: null,
          data_recebimento: null,
          status: 'pendente',
          total_itens: 22,
          valor_total: 189000.00,
          usuario_criacao: 'Sofia Machado',
          usuario_envio: null,
          usuario_recebimento: null,
          observacao: 'Aguardando aprovação do gerente'
        }
      ];

      const totalTransferencias = 45;
      const totalPages = Math.ceil(totalTransferencias / limit);

      // Lista de lojas para filtros
      const lojas = [
        { id: 1, nome: 'Loja Centro', codigo: 'LC001' },
        { id: 2, nome: 'Loja Matola', codigo: 'LM002' },
        { id: 3, nome: 'Loja Beira', codigo: 'LB003' },
        { id: 4, nome: 'Loja Nampula', codigo: 'LN004' }
      ];

      res.render('estoque/transferencias', {
        title: 'Transferências entre Lojas - SYNTRA ERP',
        layout: 'layouts/main',
        transferencias,
        lojas,
        currentPage: parseInt(page),
        totalPages,
        search,
        status,
        loja_origem,
        loja_destino
      });
    } catch (error) {
      console.error('Erro ao carregar transferências:', error);
      req.flash('error', 'Erro ao carregar transferências');
      res.redirect('/estoque/resumo');
    }
  }

  // Formulário para nova transferência
  async create(req, res) {
    try {
      // Lista de lojas
      const lojas = [
        { id: 1, nome: 'Loja Centro', codigo: 'LC001', endereco: 'Av. Julius Nyerere, 123' },
        { id: 2, nome: 'Loja Matola', codigo: 'LM002', endereco: 'Av. FPLm, 456' },
        { id: 3, nome: 'Loja Beira', codigo: 'LB003', endereco: 'Av. Samora Machel, 789' },
        { id: 4, nome: 'Loja Nampula', codigo: 'LN004', endereco: 'Av. Eduardo Mondlane, 321' }
      ];

      // Lista de produtos disponíveis
      const produtos = [
        {
          id: 1,
          codigo: 'PROD001',
          nome: 'Laptop Dell Inspiron 15',
          categoria: 'Informática',
          preco_custo: 38000.00,
          estoque_atual: 25,
          unidade: 'UN'
        },
        {
          id: 2,
          codigo: 'PROD002',
          nome: 'Mouse Wireless Logitech',
          categoria: 'Acessórios',
          preco_custo: 650.00,
          estoque_atual: 50,
          unidade: 'UN'
        },
        {
          id: 3,
          codigo: 'PROD003',
          nome: 'Monitor LED 24"',
          categoria: 'Informática',
          preco_custo: 7200.00,
          estoque_atual: 15,
          unidade: 'UN'
        }
      ];

      res.render('estoque/transferencias-create', {
        title: 'Nova Transferência - SYNTRA ERP',
        layout: 'layouts/main',
        lojas,
        produtos
      });
    } catch (error) {
      console.error('Erro ao carregar formulário de transferência:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/estoque/transferencias');
    }
  }

  // Criar nova transferência
  async store(req, res) {
    try {
      const { loja_origem, loja_destino, observacao, itens } = req.body;

      // Simular criação da transferência
      const novaTransferencia = {
        numero: `TRANS-2024-${String(Date.now()).slice(-3)}`,
        loja_origem,
        loja_destino,
        observacao,
        itens: JSON.parse(itens),
        data_criacao: new Date(),
        status: 'pendente',
        usuario_criacao: req.user.nome
      };

      req.flash('success', `Transferência ${novaTransferencia.numero} criada com sucesso!`);
      res.redirect('/estoque/transferencias');
    } catch (error) {
      console.error('Erro ao criar transferência:', error);
      req.flash('error', 'Erro ao criar transferência');
      res.redirect('/estoque/transferencias/create');
    }
  }

  // Exibir detalhes da transferência
  async show(req, res) {
    try {
      const { id } = req.params;

      // Dados fictícios para uma transferência específica
      const transferencia = {
        id: parseInt(id),
        numero: 'TRANS-2024-001',
        loja_origem: {
          id: 1,
          nome: 'Loja Centro',
          codigo: 'LC001',
          endereco: 'Av. Julius Nyerere, 123',
          telefone: '+258 21 123456'
        },
        loja_destino: {
          id: 2,
          nome: 'Loja Matola',
          codigo: 'LM002',
          endereco: 'Av. FPLm, 456',
          telefone: '+258 21 654321'
        },
        data_criacao: new Date('2024-01-15T10:30:00'),
        data_envio: new Date('2024-01-15T14:20:00'),
        data_recebimento: new Date('2024-01-16T09:15:00'),
        status: 'concluida',
        usuario_criacao: 'João Silva',
        usuario_envio: 'Maria Santos',
        usuario_recebimento: 'Carlos Mendes',
        observacao: 'Transferência de produtos em excesso para equilibrar estoque',
        itens: [
          {
            id: 1,
            produto: {
              codigo: 'PROD001',
              nome: 'Laptop Dell Inspiron 15',
              categoria: 'Informática'
            },
            quantidade: 5,
            preco_unitario: 38000.00,
            valor_total: 190000.00
          },
          {
            id: 2,
            produto: {
              codigo: 'PROD002',
              nome: 'Mouse Wireless Logitech',
              categoria: 'Acessórios'
            },
            quantidade: 10,
            preco_unitario: 650.00,
            valor_total: 6500.00
          }
        ],
        total_itens: 15,
        valor_total: 196500.00
      };

      res.render('estoque/transferencias-show', {
        title: `Transferência #${transferencia.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        transferencia
      });
    } catch (error) {
      console.error('Erro ao carregar transferência:', error);
      req.flash('error', 'Erro ao carregar transferência');
      res.redirect('/estoque/transferencias');
    }
  }
}

module.exports = TransferenciaController;