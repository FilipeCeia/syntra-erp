// ====================================
// src/controllers/compras/despesaController.js
// ====================================
const { Despesa, Fornecedor } = require('../../models');
const { Op } = require('sequelize');

class DespesaController {
  // Listar despesas
  async index(req, res) {
    try {
      const { page = 1, search = '', status = '', categoria = '' } = req.query;
      const limit = 10;
      const offset = (page - 1) * limit;

      // Dados fictícios de despesas
      const despesas = [
        {
          id: 1,
          numero: 'DSP-2024-001',
          descricao: 'Aluguel do escritório - Janeiro 2024',
          categoria: 'Aluguel',
          fornecedor: { nome: 'Imobiliária Central', nuit: '400111222' },
          valor_base: 21367.52,
          valor_iva: 3632.48,
          valor_total: 25000.00,
          data_despesa: new Date('2024-01-01'),
          data_vencimento: new Date('2024-01-31'),
          status: 'Pago'
        },
        {
          id: 2,
          numero: 'DSP-2024-002',
          descricao: 'Conta de energia elétrica - Janeiro 2024',
          categoria: 'Energia',
          fornecedor: { nome: 'EDM - Electricidade de Moçambique', nuit: '400222333' },
          valor_base: 7264.96,
          valor_iva: 1235.04,
          valor_total: 8500.00,
          data_despesa: new Date('2024-01-10'),
          data_vencimento: new Date('2024-01-25'),
          status: 'Pago'
        },
        {
          id: 3,
          numero: 'DSP-2024-003',
          descricao: 'Serviços de internet e telefone',
          categoria: 'Internet',
          fornecedor: { nome: 'Vodacom Moçambique', nuit: '400333444' },
          valor_base: 4273.50,
          valor_iva: 726.50,
          valor_total: 5000.00,
          data_despesa: new Date('2024-01-15'),
          data_vencimento: new Date('2024-02-15'),
          status: 'Pendente'
        },
        {
          id: 4,
          numero: 'DSP-2024-004',
          descricao: 'Material de escritório',
          categoria: 'Material Escritório',
          fornecedor: { nome: 'Papelaria Central', nuit: '400444555' },
          valor_base: 2564.10,
          valor_iva: 435.90,
          valor_total: 3000.00,
          data_despesa: new Date('2024-01-12'),
          data_vencimento: new Date('2024-02-12'),
          status: 'Pendente'
        },
        {
          id: 5,
          numero: 'DSP-2024-005',
          descricao: 'Combustível para viaturas',
          categoria: 'Combustível',
          fornecedor: { nome: 'Petromoc', nuit: '400555666' },
          valor_base: 6410.26,
          valor_iva: 1089.74,
          valor_total: 7500.00,
          data_despesa: new Date('2024-01-18'),
          data_vencimento: new Date('2024-01-18'),
          status: 'Pago'
        }
      ];

      const totalDespesas = despesas.length;
      const totalPages = Math.ceil(totalDespesas / limit);

      res.render('compras/despesas/index', {
        title: 'Despesas - SYNTRA ERP',
        layout: 'layouts/main',
        despesas,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalDespesas,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: { search, status, categoria }
      });
    } catch (error) {
      console.error('Erro ao listar despesas:', error);
      req.flash('error', 'Erro ao carregar despesas');
      res.redirect('/compras');
    }
  }

  // Formulário para nova despesa
  async create(req, res) {
    try {
      // Dados fictícios para o formulário
      const fornecedores = [
        {
          id: 1,
          nome: 'Imobiliária Central',
          nuit: '400111222',
          endereco: 'Av. 25 de Setembro, 1000, Maputo',
          telefone: '+258 21 111 222',
          email: 'geral@imobcentral.co.mz'
        },
        {
          id: 2,
          nome: 'EDM - Electricidade de Moçambique',
          nuit: '400222333',
          endereco: 'Av. Agostinho Neto, 100, Maputo',
          telefone: '+258 21 222 333',
          email: 'atendimento@edm.co.mz'
        },
        {
          id: 3,
          nome: 'Vodacom Moçambique',
          nuit: '400333444',
          endereco: 'Av. Julius Nyerere, 2000, Maputo',
          telefone: '+258 21 333 444',
          email: 'empresas@vodacom.co.mz'
        },
        {
          id: 4,
          nome: 'Papelaria Central',
          nuit: '400444555',
          endereco: 'Av. Eduardo Mondlane, 500, Maputo',
          telefone: '+258 21 444 555',
          email: 'vendas@papelariacentral.co.mz'
        },
        {
          id: 5,
          nome: 'Petromoc',
          nuit: '400555666',
          endereco: 'Av. Marginal, 300, Maputo',
          telefone: '+258 21 555 666',
          email: 'comercial@petromoc.co.mz'
        }
      ];

      res.render('compras/despesas/create', {
        title: 'Nova Despesa - SYNTRA ERP',
        layout: 'layouts/main',
        fornecedores
      });
    } catch (error) {
      console.error('Erro ao carregar formulário de despesa:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/compras/despesas');
    }
  }

  // Salvar nova despesa
  async store(req, res) {
    try {
      const {
        descricao,
        categoria,
        fornecedor_id,
        data_despesa,
        data_vencimento,
        valor_base,
        desconto,
        iva_taxa,
        forma_pagamento,
        observacoes
      } = req.body;

      // Calcular valores
      const valorDesconto = parseFloat(valor_base) * (parseFloat(desconto) / 100);
      const baseIva = parseFloat(valor_base) - valorDesconto;
      const valorIva = baseIva * (parseFloat(iva_taxa) / 100);
      const total = baseIva + valorIva;

      // Simular salvamento
      console.log('Nova despesa:', {
        descricao,
        categoria,
        fornecedor_id,
        data_despesa,
        data_vencimento,
        valor_base: parseFloat(valor_base),
        desconto: parseFloat(desconto),
        valor_iva: valorIva,
        valor_total: total,
        forma_pagamento,
        observacoes
      });

      req.flash('success', 'Despesa criada com sucesso!');
      res.redirect('/compras/despesas');
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
      req.flash('error', 'Erro ao salvar despesa');
      res.redirect('/compras/despesas/create');
    }
  }

  // Salvar e marcar como pago
  async storeAndPay(req, res) {
    try {
      // Primeiro salva a despesa
      await this.store(req, res);
      
      // Depois marca como pago (simulação)
      req.flash('success', 'Despesa criada e marcada como paga!');
      res.redirect('/compras/despesas');
    } catch (error) {
      console.error('Erro ao salvar e pagar despesa:', error);
      req.flash('error', 'Erro ao processar despesa');
      res.redirect('/compras/despesas/create');
    }
  }

  // Ver detalhes da despesa
  async show(req, res) {
    try {
      const { id } = req.params;
      
      // Dados fictícios da despesa
      const despesa = {
        id: parseInt(id),
        numero: 'DSP-2024-001',
        descricao: 'Aluguel do escritório - Janeiro 2024',
        categoria: 'Aluguel',
        fornecedor: {
          nome: 'Imobiliária Central',
          nuit: '400111222',
          endereco: 'Av. 25 de Setembro, 1000, Maputo',
          telefone: '+258 21 111 222',
          email: 'geral@imobcentral.co.mz'
        },
        valor_base: 21367.52,
        desconto: 0.00,
        valor_iva: 3632.48,
        valor_total: 25000.00,
        data_despesa: new Date('2024-01-01'),
        data_vencimento: new Date('2024-01-31'),
        forma_pagamento: 'À Vista',
        status: 'Pago',
        observacoes: 'Pagamento mensal do aluguel do escritório principal',
        data_criacao: new Date('2024-01-01'),
        usuario: 'Admin Sistema'
      };

      res.render('compras/despesas/show', {
        title: `Despesa ${despesa.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        despesa
      });
    } catch (error) {
      console.error('Erro ao carregar despesa:', error);
      req.flash('error', 'Erro ao carregar despesa');
      res.redirect('/compras/despesas');
    }
  }
}

module.exports = DespesaController;