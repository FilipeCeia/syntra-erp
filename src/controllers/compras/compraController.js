// ====================================
// src/controllers/compras/compraController.js
// ====================================
const { Compra, Fornecedor, Artigo } = require('../../models');
const { Op } = require('sequelize');

class CompraController {
  // Dashboard de compras
  async dashboard(req, res) {
    try {
      // Dados fictícios para o dashboard
      const dashboardData = {
        resumo: {
          compras_hoje: 45250.00,
          compras_mes: 1245780.50,
          compras_pendentes: 8,
          fornecedores_ativos: 24,
          ticket_medio: 15430.75,
          crescimento_mensal: 12.5
        },
        compras_recentes: [
          {
            id: 1,
            numero: 'CMP-2024-001',
            fornecedor: 'Fornecedor ABC Lda',
            valor: 125430.50,
            data: new Date('2024-01-15'),
            status: 'Pago',
            tipo: 'Mercadoria'
          },
          {
            id: 2,
            numero: 'CMP-2024-002',
            fornecedor: 'Tech Solutions Lda',
            valor: 45250.00,
            data: new Date('2024-01-15'),
            status: 'Pendente',
            tipo: 'Mercadoria'
          },
          {
            id: 3,
            numero: 'DSP-2024-001',
            fornecedor: 'Imobiliária Central',
            valor: 25000.00,
            data: new Date('2024-01-14'),
            status: 'Pago',
            tipo: 'Despesa'
          }
        ],
        top_fornecedores: [
          { nome: 'Fornecedor ABC Lda', nuit: '400123456', total_compras: 425430.50, total_documentos: 15 },
          { nome: 'Tech Solutions Lda', nuit: '400234567', total_compras: 298750.30, total_documentos: 8 },
          { nome: 'Distribuidora XYZ', nuit: '400345678', total_compras: 176890.15, total_documentos: 12 }
        ],
        top_produtos: [
          { nome: 'Laptop Dell Inspiron', quantidade: 25, valor: 500000.00 },
          { nome: 'Smartphone Samsung A54', quantidade: 45, valor: 675000.00 },
          { nome: 'Monitor LG 24"', quantidade: 32, valor: 256000.00 },
          { nome: 'Impressora HP LaserJet', quantidade: 18, valor: 324000.00 },
          { nome: 'Teclado Mecânico', quantidade: 67, valor: 134000.00 }
        ],
        compras_por_mes: [
          { mes: 'Jan', compras: 1245780.50, orcamento: 1500000.00 },
          { mes: 'Dez', compras: 1098430.20, orcamento: 1200000.00 },
          { mes: 'Nov', compras: 956780.90, orcamento: 1100000.00 }
        ]
      };

      res.render('compras/dashboard', {
        title: 'Dashboard Compras - SYNTRA ERP',
        layout: 'layouts/main',
        dashboardData
      });
    } catch (error) {
      console.error('Erro no dashboard de compras:', error);
      req.flash('error', 'Erro ao carregar dashboard');
      res.redirect('/dashboard');
    }
  }

  // Listar todas as compras
  async index(req, res) {
    try {
      const { page = 1, search = '', status = '', tipo = '' } = req.query;
      const limit = 10;
      const offset = (page - 1) * limit;

      // Dados fictícios de compras
      const compras = [
        {
          id: 1,
          numero: 'CMP-2024-001',
          fornecedor: { nome: 'Fornecedor ABC Lda', nuit: '400123456' },
          valor_total: 125430.50,
          valor_iva: 21073.19,
          data_compra: new Date('2024-01-15'),
          data_vencimento: new Date('2024-02-15'),
          status: 'Pago',
          tipo: 'Mercadoria',
          observacoes: 'Compra de equipamentos'
        },
        {
          id: 2,
          numero: 'CMP-2024-002',
          fornecedor: { nome: 'Tech Solutions Lda', nuit: '400234567' },
          valor_total: 45250.00,
          valor_iva: 7592.50,
          data_compra: new Date('2024-01-15'),
          data_vencimento: new Date('2024-02-15'),
          status: 'Pendente',
          tipo: 'Mercadoria',
          observacoes: 'Prazo 30 dias'
        },
        {
          id: 3,
          numero: 'CMP-2024-003',
          fornecedor: { nome: 'Distribuidora XYZ', nuit: '400345678' },
          valor_total: 78750.20,
          valor_iva: 13207.53,
          data_compra: new Date('2024-01-14'),
          data_vencimento: new Date('2024-02-14'),
          status: 'Pendente',
          tipo: 'Mercadoria',
          observacoes: 'Produtos para revenda'
        },
        {
          id: 4,
          numero: 'DSP-2024-001',
          fornecedor: { nome: 'Imobiliária Central', nuit: '400111222' },
          valor_total: 25000.00,
          valor_iva: 4250.00,
          data_compra: new Date('2024-01-01'),
          data_vencimento: new Date('2024-01-31'),
          status: 'Pago',
          tipo: 'Despesa',
          observacoes: 'Aluguel Janeiro 2024'
        },
        {
          id: 5,
          numero: 'DSP-2024-002',
          fornecedor: { nome: 'EDM - Electricidade de Moçambique', nuit: '400222333' },
          valor_total: 8500.00,
          valor_iva: 1445.00,
          data_compra: new Date('2024-01-10'),
          data_vencimento: new Date('2024-01-25'),
          status: 'Pago',
          tipo: 'Despesa',
          observacoes: 'Conta de energia'
        }
      ];

      const totalCompras = compras.length;
      const totalPages = Math.ceil(totalCompras / limit);

      res.render('compras/index', {
        title: 'Compras - SYNTRA ERP',
        layout: 'layouts/main',
        compras,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalCompras,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: { search, status, tipo }
      });
    } catch (error) {
      console.error('Erro ao listar compras:', error);
      req.flash('error', 'Erro ao carregar compras');
      res.redirect('/dashboard');
    }
  }

  // Listar compras de mercadoria
  async mercadoria(req, res) {
    try {
      const { page = 1, search = '', status = '', fornecedor = '' } = req.query;
      const limit = 10;
      const offset = (page - 1) * limit;

      // Dados fictícios de compras de mercadoria
      const compras = [
        {
          id: 1,
          numero: 'CMP-2024-001',
          fornecedor: { nome: 'Fornecedor ABC Lda', nuit: '400123456' },
          valor_liquido: 107264.96,
          valor_iva: 18215.04,
          valor_total: 125430.50,
          data_compra: new Date('2024-01-15'),
          data_vencimento: new Date('2024-02-15'),
          status: 'Pago'
        },
        {
          id: 2,
          numero: 'CMP-2024-002',
          fornecedor: { nome: 'Tech Solutions Lda', nuit: '400234567' },
          valor_liquido: 38675.21,
          valor_iva: 6574.79,
          valor_total: 45250.00,
          data_compra: new Date('2024-01-15'),
          data_vencimento: new Date('2024-02-15'),
          status: 'Pendente'
        },
        {
          id: 3,
          numero: 'CMP-2024-003',
          fornecedor: { nome: 'Distribuidora XYZ', nuit: '400345678' },
          valor_liquido: 67307.86,
          valor_iva: 11442.34,
          valor_total: 78750.20,
          data_compra: new Date('2024-01-14'),
          data_vencimento: new Date('2024-02-14'),
          status: 'Pendente'
        }
      ];

      const totalCompras = compras.length;
      const totalPages = Math.ceil(totalCompras / limit);

      res.render('compras/mercadoria/index', {
        title: 'Compras de Mercadoria - SYNTRA ERP',
        layout: 'layouts/main',
        compras,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalCompras,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: { search, status, fornecedor }
      });
    } catch (error) {
      console.error('Erro ao listar compras de mercadoria:', error);
      req.flash('error', 'Erro ao carregar compras de mercadoria');
      res.redirect('/compras');
    }
  }

  // Formulário para nova compra de mercadoria
  async createMercadoria(req, res) {
    try {
      // Dados fictícios para o formulário
      const fornecedores = [
        {
          id: 1,
          nome: 'Fornecedor ABC Lda',
          nuit: '400123456',
          endereco_fiscal: 'Av. Julius Nyerere, 1000, Maputo',
          telefone: '+258 21 123 456',
          email: 'geral@fornecedorabc.co.mz'
        },
        {
          id: 2,
          nome: 'Tech Solutions Lda',
          nuit: '400234567',
          endereco_fiscal: 'Av. 25 de Setembro, 500, Maputo',
          telefone: '+258 21 234 567',
          email: 'vendas@techsolutions.co.mz'
        },
        {
          id: 3,
          nome: 'Distribuidora XYZ',
          nuit: '400345678',
          endereco_fiscal: 'Av. Agostinho Neto, 200, Maputo',
          telefone: '+258 21 345 678',
          email: 'comercial@distribuidoraxyz.co.mz'
        }
      ];

      const artigos = [
        {
          id: 1,
          nome: 'Laptop Dell Inspiron 15',
          codigo: 'DELL-INS-15',
          preco_custo: 20000.00,
          unidade: 'Unidade'
        },
        {
          id: 2,
          nome: 'Smartphone Samsung A54',
          codigo: 'SAM-A54',
          preco_custo: 15000.00,
          unidade: 'Unidade'
        },
        {
          id: 3,
          nome: 'Monitor LG 24"',
          codigo: 'LG-MON-24',
          preco_custo: 8000.00,
          unidade: 'Unidade'
        }
      ];

      res.render('compras/mercadoria/create', {
        title: 'Nova Compra de Mercadoria - SYNTRA ERP',
        layout: 'layouts/main',
        fornecedores,
        artigos
      });
    } catch (error) {
      console.error('Erro ao carregar formulário de compra:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/compras/mercadoria');
    }
  }

  // Salvar nova compra de mercadoria
  async storeMercadoria(req, res) {
    try {
      const {
        fornecedor_id,
        data_compra,
        data_vencimento,
        forma_pagamento,
        observacoes,
        artigos
      } = req.body;

      // Simular salvamento
      console.log('Nova compra de mercadoria:', {
        fornecedor_id,
        data_compra,
        data_vencimento,
        forma_pagamento,
        observacoes,
        artigos
      });

      req.flash('success', 'Compra de mercadoria criada com sucesso!');
      res.redirect('/compras/mercadoria');
    } catch (error) {
      console.error('Erro ao salvar compra:', error);
      req.flash('error', 'Erro ao salvar compra');
      res.redirect('/compras/mercadoria/create');
    }
  }

  // Relatórios de compras
  async relatorios(req, res) {
    try {
      const { data_inicio = '', data_fim = '', fornecedor_id = '' } = req.query;
      
      // Dados fictícios para relatórios
      const relatoriosData = {
        periodo: 'Janeiro 2024',
        resumo: {
          total_compras: 1245780.50,
          total_transacoes: 156,
          ticket_medio: 7985.39,
          crescimento: 12.5
        },
        compras_por_fornecedor: [
          { fornecedor: 'Fornecedor ABC Lda', compras: 425430.50, participacao: 34.2 },
          { fornecedor: 'Tech Solutions Lda', compras: 298750.30, participacao: 24.0 },
          { fornecedor: 'Distribuidora XYZ', compras: 276890.15, participacao: 22.2 },
          { fornecedor: 'Outros Fornecedores', compras: 244709.55, participacao: 19.6 }
        ],
        produtos_mais_comprados: [
          { produto: 'Laptop Dell Inspiron', quantidade: 25, valor: 500000.00 },
          { produto: 'Smartphone Samsung A54', quantidade: 45, valor: 675000.00 },
          { produto: 'Monitor LG 24"', quantidade: 32, valor: 256000.00 }
        ]
      };

      res.render('compras/relatorios', {
        title: 'Relatórios de Compras - SYNTRA ERP',
        layout: 'layouts/main',
        relatoriosData,
        filters: { data_inicio, data_fim, fornecedor_id }
      });
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      req.flash('error', 'Erro ao carregar relatórios');
      res.redirect('/compras');
    }
  }
}

module.exports = CompraController;