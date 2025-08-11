// ====================================
// src/controllers/vendas/facturaController.js
// ====================================
const { Factura, Cliente, Artigo } = require('../../models');
const { Op } = require('sequelize');

class FacturaController {
  // Listar facturas
  async index(req, res) {
    try {
      const { page = 1, search = '', status = '', tipo = '' } = req.query;
      const limit = 10;
      const offset = (page - 1) * limit;

      // Dados fictícios de facturas
      const facturas = [
        {
          id: 1,
          numero: 'FT2024/001',
          serie: 'FT',
          sequencia: 1,
          cliente: {
            id: 1,
            nome: 'Empresa ABC Lda',
            nuit: '123456789',
            endereco_fiscal: 'Av. Julius Nyerere, 123, Maputo'
          },
          data_emissao: new Date('2024-01-15'),
          data_vencimento: new Date('2024-02-15'),
          valor_liquido: 28250.00,
          valor_iva: 5057.50,
          valor_total: 33307.50,
          status: 'Emitida',
          tipo: 'Factura',
          condicoes_pagamento: '30 dias',
          observacoes: 'Entrega em 5 dias úteis'
        },
        {
          id: 2,
          numero: 'FT2024/002',
          serie: 'FT',
          sequencia: 2,
          cliente: {
            id: 2,
            nome: 'João Silva',
            nuit: '987654321',
            endereco_fiscal: 'Rua da Paz, 456, Matola'
          },
          data_emissao: new Date('2024-01-14'),
          data_vencimento: new Date('2024-02-14'),
          valor_liquido: 8250.00,
          valor_iva: 1471.53,
          valor_total: 9721.53,
          status: 'Pendente',
          tipo: 'Factura',
          condicoes_pagamento: '30 dias',
          observacoes: 'Cliente preferencial'
        },
        {
          id: 3,
          numero: 'FT2024/003',
          serie: 'FT',
          sequencia: 3,
          cliente: {
            id: 3,
            nome: 'Maria Costa',
            nuit: '456789123',
            endereco_fiscal: 'Av. Samora Machel, 789, Beira'
          },
          data_emissao: new Date('2024-01-13'),
          data_vencimento: new Date('2024-01-13'),
          valor_liquido: 15750.00,
          valor_iva: 2677.50,
          valor_total: 18427.50,
          status: 'Paga',
          tipo: 'Factura',
          condicoes_pagamento: 'À vista',
          observacoes: 'Pagamento por transferência'
        }
      ];

      const totalFacturas = facturas.length;
      const totalPages = Math.ceil(totalFacturas / limit);

      res.render('vendas/facturas/index', {
        title: 'Facturas - SYNTRA ERP',
        layout: 'layouts/main',
        facturas,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalFacturas,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: { search, status, tipo }
      });
    } catch (error) {
      console.error('Erro ao listar facturas:', error);
      req.flash('error', 'Erro ao carregar facturas');
      res.redirect('/vendas');
    }
  }

  // Formulário de criação de factura
  async create(req, res) {
    try {
      // Dados fictícios para o formulário
      const clientes = [
        { id: 1, nome: 'Empresa ABC Lda', nuit: '123456789' },
        { id: 2, nome: 'João Silva', nuit: '987654321' },
        { id: 3, nome: 'Maria Costa', nuit: '456789123' },
        { id: 4, nome: 'Construtora XYZ', nuit: '147258369' },
        { id: 5, nome: 'Supermercado Central', nuit: '369258147' }
      ];

      const artigos = [
        {
          id: 1,
          codigo: 'ART001',
          nome: 'Smartphone Samsung A54',
          preco_venda: 15000.00,
          unidade: 'UN',
          iva_percentual: 17.0,
          stock_atual: 25
        },
        {
          id: 2,
          codigo: 'ART002',
          nome: 'Cabo USB-C',
          preco_venda: 250.00,
          unidade: 'UN',
          iva_percentual: 17.0,
          stock_atual: 150
        },
        {
          id: 3,
          codigo: 'ART003',
          nome: 'Notebook Lenovo ThinkPad',
          preco_venda: 45000.00,
          unidade: 'UN',
          iva_percentual: 17.0,
          stock_atual: 8
        },
        {
          id: 4,
          codigo: 'ART004',
          nome: 'Mouse Wireless',
          preco_venda: 750.00,
          unidade: 'UN',
          iva_percentual: 17.0,
          stock_atual: 45
        }
      ];

      // Próximo número sequencial
      const proximoNumero = 'FT2024/004';

      res.render('vendas/facturas/create', {
        title: 'Nova Factura - SYNTRA ERP',
        layout: 'layouts/main',
        clientes,
        artigos,
        proximoNumero,
        condicoesPagamento: [
          { valor: 'vista', texto: 'À Vista' },
          { valor: '15_dias', texto: '15 Dias' },
          { valor: '30_dias', texto: '30 Dias' },
          { valor: '60_dias', texto: '60 Dias' },
          { valor: '90_dias', texto: '90 Dias' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar formulário de factura:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/vendas/facturas');
    }
  }

  // Salvar nova factura
  async store(req, res) {
    try {
      const {
        cliente_id,
        data_emissao,
        data_vencimento,
        condicoes_pagamento,
        observacoes,
        itens
      } = req.body;

      // Simulação de criação de factura
      const novaFactura = {
        id: 4,
        numero: 'FT2024/004',
        serie: 'FT',
        sequencia: 4,
        cliente_id: parseInt(cliente_id),
        data_emissao: new Date(data_emissao),
        data_vencimento: new Date(data_vencimento),
        condicoes_pagamento,
        observacoes,
        status: 'Rascunho',
        valor_total: 0 // Será calculado com base nos itens
      };

      req.flash('success', `Factura ${novaFactura.numero} criada com sucesso!`);
      res.redirect(`/vendas/facturas/${novaFactura.id}`);
    } catch (error) {
      console.error('Erro ao criar factura:', error);
      req.flash('error', 'Erro ao criar factura');
      res.redirect('/vendas/facturas/create');
    }
  }

  // Exibir detalhes da factura
  async show(req, res) {
    try {
      const { id } = req.params;

      // Dados fictícios de uma factura específica
      const factura = {
        id: parseInt(id),
        numero: 'FT2024/001',
        serie: 'FT',
        sequencia: 1,
        cliente: {
          nome: 'Empresa ABC Lda',
          nuit: '123456789',
          email: 'contato@empresaabc.co.mz',
          telefone: '+258 21 123 456',
          endereco_fiscal: 'Av. Julius Nyerere, 123, Maputo'
        },
        data_emissao: new Date('2024-01-15'),
        data_vencimento: new Date('2024-02-15'),
        condicoes_pagamento: '30 dias',
        moeda: 'MZN',
        taxa_cambio: 1.00,
        itens: [
          {
            id: 1,
            artigo: {
              codigo: 'ART001',
              nome: 'Smartphone Samsung A54',
              unidade: 'UN'
            },
            quantidade: 2,
            preco_unitario: 15000.00,
            desconto_percentual: 5.0,
            desconto_valor: 1500.00,
            subtotal: 28500.00,
            iva_percentual: 17.0,
            iva_valor: 4845.00,
            total: 33345.00
          },
          {
            id: 2,
            artigo: {
              codigo: 'ART002',
              nome: 'Cabo USB-C',
              unidade: 'UN'
            },
            quantidade: 5,
            preco_unitario: 250.00,
            desconto_percentual: 0.0,
            desconto_valor: 0.00,
            subtotal: 1250.00,
            iva_percentual: 17.0,
            iva_valor: 212.50,
            total: 1462.50
          }
        ],
        subtotal: 29750.00,
        desconto_total: 1500.00,
        valor_liquido: 28250.00,
        iva_total: 5057.50,
        valor_total: 33307.50,
        status: 'Emitida',
        observacoes: 'Entrega em 5 dias úteis',
        qr_code: 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=FT2024/001|33307.50|2024-01-15',
        hash_validacao: 'A1B2C3D4E5F6G7H8I9J0',
        dados_fiscais: {
          empresa_nome: 'SYNTRA ERP Lda',
          empresa_nuit: '400123456',
          empresa_endereco: 'Av. Vladimir Lenine, 2000, Maputo',
          regime_iva: 'Regime Geral'
        }
      };

      res.render('vendas/facturas/show', {
        title: `Factura ${factura.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        factura
      });
    } catch (error) {
      console.error('Erro ao exibir factura:', error);
      req.flash('error', 'Factura não encontrada');
      res.redirect('/vendas/facturas');
    }
  }

  // Formulário de edição
  async edit(req, res) {
    try {
      const { id } = req.params;

      // Dados fictícios da factura para edição
      const factura = {
        id: parseInt(id),
        numero: 'FT2024/001',
        cliente_id: 1,
        data_emissao: '2024-01-15',
        data_vencimento: '2024-02-15',
        condicoes_pagamento: '30_dias',
        observacoes: 'Entrega em 5 dias úteis',
        status: 'Rascunho'
      };

      const clientes = [
        { id: 1, nome: 'Empresa ABC Lda', nuit: '123456789' },
        { id: 2, nome: 'João Silva', nuit: '987654321' },
        { id: 3, nome: 'Maria Costa', nuit: '456789123' }
      ];

      res.render('vendas/facturas/edit', {
        title: `Editar Factura ${factura.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        factura,
        clientes,
        condicoesPagamento: [
          { valor: 'vista', texto: 'À Vista' },
          { valor: '15_dias', texto: '15 Dias' },
          { valor: '30_dias', texto: '30 Dias' },
          { valor: '60_dias', texto: '60 Dias' },
          { valor: '90_dias', texto: '90 Dias' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar edição de factura:', error);
      req.flash('error', 'Factura não encontrada');
      res.redirect('/vendas/facturas');
    }
  }

  // Atualizar factura
  async update(req, res) {
    try {
      const { id } = req.params;
      const { cliente_id, data_vencimento, condicoes_pagamento, observacoes } = req.body;

      // Simulação de atualização
      req.flash('success', 'Factura atualizada com sucesso!');
      res.redirect(`/vendas/facturas/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar factura:', error);
      req.flash('error', 'Erro ao atualizar factura');
      res.redirect(`/vendas/facturas/${req.params.id}/edit`);
    }
  }

  // Emitir factura (finalizar)
  async emitir(req, res) {
    try {
      const { id } = req.params;

      // Simulação de emissão
      req.flash('success', 'Factura emitida com sucesso!');
      res.redirect(`/vendas/facturas/${id}`);
    } catch (error) {
      console.error('Erro ao emitir factura:', error);
      req.flash('error', 'Erro ao emitir factura');
      res.redirect(`/vendas/facturas/${id}`);
    }
  }

  // Cancelar factura
  async cancelar(req, res) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      // Simulação de cancelamento
      req.flash('success', 'Factura cancelada com sucesso!');
      res.redirect(`/vendas/facturas/${id}`);
    } catch (error) {
      console.error('Erro ao cancelar factura:', error);
      req.flash('error', 'Erro ao cancelar factura');
      res.redirect(`/vendas/facturas/${id}`);
    }
  }

  // Imprimir factura
  async imprimir(req, res) {
    try {
      const { id } = req.params;

      // Dados da factura para impressão
      const factura = {
        numero: 'FT2024/001',
        data_emissao: new Date('2024-01-15'),
        cliente: {
          nome: 'Empresa ABC Lda',
          nuit: '123456789',
          endereco_fiscal: 'Av. Julius Nyerere, 123, Maputo'
        },
        valor_total: 33307.50,
        qr_code: 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=FT2024/001|33307.50|2024-01-15'
      };

      res.render('vendas/facturas/print', {
        title: `Imprimir Factura ${factura.numero}`,
        layout: 'layouts/print',
        factura
      });
    } catch (error) {
      console.error('Erro ao imprimir factura:', error);
      req.flash('error', 'Erro ao imprimir factura');
      res.redirect(`/vendas/facturas/${id}`);
    }
  }
}

module.exports = FacturaController;