// ====================================
// src/controllers/vendas/vendaController.js
// ====================================
const { Venda, Cliente, Artigo } = require('../../models');
const { Op } = require('sequelize');

class VendaController {
  // Dashboard de vendas
  async dashboard(req, res) {
    try {
      // Dados fictícios para o dashboard
      const dashboardData = {
        resumo: {
          vendas_hoje: 45230.50,
          vendas_mes: 342150.75,
          facturas_pendentes: 12,
          cotacoes_abertas: 8,
          ticket_medio: 1250.30,
          crescimento_mensal: 15.8
        },
        vendas_recentes: [
          {
            id: 1,
            numero: 'FT2024/001',
            cliente: 'Empresa ABC Lda',
            valor: 25430.50,
            data: new Date('2024-01-15'),
            status: 'Paga',
            tipo: 'Factura'
          },
          {
            id: 2,
            numero: 'FR2024/001',
            cliente: 'João Silva',
            valor: 1250.00,
            data: new Date('2024-01-15'),
            status: 'Paga',
            tipo: 'Factura-Recibo'
          },
          {
            id: 3,
            numero: 'CT2024/001',
            cliente: 'Maria Costa',
            valor: 8750.20,
            data: new Date('2024-01-14'),
            status: 'Pendente',
            tipo: 'Cotação'
          }
        ],
        top_clientes: [
          { nome: 'Empresa ABC Lda', nuit: '123456789', total_vendas: 125430.50, total_documentos: 15 },
          { nome: 'Construtora XYZ', nuit: '987654321', total_vendas: 98750.30, total_documentos: 8 },
          { nome: 'Supermercado Central', nuit: '456789123', total_vendas: 76890.15, total_documentos: 22 }
        ],
        top_artigos: [
          { nome: 'Smartphone Samsung A54', quantidade: 45, valor: 675000.00 },
          { nome: 'Laptop Dell Inspiron', quantidade: 23, valor: 460000.00 },
          { nome: 'Tablet iPad Air', quantidade: 18, valor: 324000.00 },
          { nome: 'Monitor LG 24"', quantidade: 32, valor: 256000.00 },
          { nome: 'Teclado Mecânico', quantidade: 67, valor: 134000.00 }
        ],
        vendas_por_mes: [
          { mes: 'Jan', vendas: 342150.75, meta: 400000.00 },
          { mes: 'Dez', vendas: 298430.20, meta: 350000.00 },
          { mes: 'Nov', vendas: 356780.90, meta: 350000.00 }
        ]
      };

      res.render('vendas/dashboard', {
        title: 'Dashboard Vendas - SYNTRA ERP',
        layout: 'layouts/main',
        dashboardData
      });
    } catch (error) {
      console.error('Erro no dashboard de vendas:', error);
      req.flash('error', 'Erro ao carregar dashboard');
      res.redirect('/dashboard');
    }
  }

  // Listar todas as vendas
  async index(req, res) {
    try {
      const { page = 1, search = '', status = '', tipo = '' } = req.query;
      const limit = 10;
      const offset = (page - 1) * limit;

      // Dados fictícios de vendas
      const vendas = [
        {
          id: 1,
          numero: 'FT2024/001',
          cliente: { nome: 'Empresa ABC Lda', nuit: '123456789' },
          valor_total: 25430.50,
          valor_iva: 4277.19,
          data_emissao: new Date('2024-01-15'),
          data_vencimento: new Date('2024-02-15'),
          status: 'Paga',
          tipo: 'Factura',
          observacoes: 'Pagamento à vista'
        },
        {
          id: 2,
          numero: 'FR2024/001',
          cliente: { nome: 'João Silva', nuit: '987654321' },
          valor_total: 1250.00,
          valor_iva: 210.00,
          data_emissao: new Date('2024-01-15'),
          data_vencimento: new Date('2024-01-15'),
          status: 'Paga',
          tipo: 'Factura-Recibo',
          observacoes: 'Pagamento imediato'
        },
        {
          id: 3,
          numero: 'FT2024/002',
          cliente: { nome: 'Maria Costa', nuit: '456789123' },
          valor_total: 8750.20,
          valor_iva: 1471.53,
          data_emissao: new Date('2024-01-14'),
          data_vencimento: new Date('2024-02-14'),
          status: 'Pendente',
          tipo: 'Factura',
          observacoes: 'Prazo 30 dias'
        }
      ];

      const totalVendas = vendas.length;
      const totalPages = Math.ceil(totalVendas / limit);

      res.render('vendas/index', {
        title: 'Vendas - SYNTRA ERP',
        layout: 'layouts/main',
        vendas,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalVendas,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: { search, status, tipo }
      });
    } catch (error) {
      console.error('Erro ao listar vendas:', error);
      req.flash('error', 'Erro ao carregar vendas');
      res.redirect('/dashboard');
    }
  }

  // Exibir detalhes de uma venda
  async show(req, res) {
    try {
      const { id } = req.params;

      // Dados fictícios de uma venda específica
      const venda = {
        id: parseInt(id),
        numero: 'FT2024/001',
        cliente: {
          nome: 'Empresa ABC Lda',
          nuit: '123456789',
          email: 'contato@empresaabc.co.mz',
          telefone: '+258 21 123 456',
          endereco: 'Av. Julius Nyerere, 123, Maputo'
        },
        data_emissao: new Date('2024-01-15'),
        data_vencimento: new Date('2024-02-15'),
        condicoes_pagamento: '30 dias',
        moeda: 'MZN',
        taxa_cambio: 1.00,
        itens: [
          {
            artigo: { codigo: 'ART001', nome: 'Smartphone Samsung A54', unidade: 'UN' },
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
            artigo: { codigo: 'ART002', nome: 'Cabo USB-C', unidade: 'UN' },
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
        qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      };

      res.render('vendas/show', {
        title: `Venda ${venda.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        venda
      });
    } catch (error) {
      console.error('Erro ao exibir venda:', error);
      req.flash('error', 'Venda não encontrada');
      res.redirect('/vendas');
    }
  }

  // Relatórios de vendas
  async relatorios(req, res) {
    try {
      const { data_inicio = '', data_fim = '', cliente_id = '', tipo = '' } = req.query;

      // Dados fictícios para relatórios
      const relatoriosData = {
        periodo: 'Janeiro 2024',
        resumo: {
          total_vendas: 342150.75,
          total_facturas: 45,
          total_cotacoes: 12,
          ticket_medio: 7603.35,
          iva_total: 58165.63
        },
        vendas_por_tipo: [
          { tipo: 'Factura', quantidade: 35, valor: 298430.50, percentual: 87.2 },
          { tipo: 'Factura-Recibo', quantidade: 10, valor: 43720.25, percentual: 12.8 }
        ],
        top_clientes: [
          { nome: 'Empresa ABC Lda', vendas: 125430.50, facturas: 15 },
          { nome: 'Construtora XYZ', vendas: 98750.30, facturas: 8 },
          { nome: 'Supermercado Central', vendas: 76890.15, facturas: 22 }
        ],
        vendas_mensais: [
          { mes: 'Jan', vendas: 342150.75, facturas: 45 },
          { mes: 'Dez', vendas: 298430.20, facturas: 38 },
          { mes: 'Nov', vendas: 356780.90, facturas: 52 }
        ],
        top_artigos: [
          { nome: 'Produto A', quantidade_vendida: 150, total_vendas: 45000.00, percentual: 13.2 },
          { nome: 'Produto B', quantidade_vendida: 120, total_vendas: 38400.00, percentual: 11.2 },
          { nome: 'Produto C', quantidade_vendida: 95, total_vendas: 28500.00, percentual: 8.3 },
          { nome: 'Produto D', quantidade_vendida: 80, total_vendas: 24000.00, percentual: 7.0 },
          { nome: 'Produto E', quantidade_vendida: 65, total_vendas: 19500.00, percentual: 5.7 }
        ],
        vendas_detalhadas: [
          { id: 1, numero: 'VD001', data_emissao: '2024-01-15', cliente_nome: 'Empresa ABC Lda', cliente_nuit: '123456789', valor_liquido: 13500.00, valor_iva: 1930.50, valor_total: 15430.50, status: 'Pago', tipo: 'Factura' },
          { id: 2, numero: 'VD002', data_emissao: '2024-01-14', cliente_nome: 'Construtora XYZ', cliente_nuit: '987654321', valor_liquido: 25217.39, valor_iva: 3532.91, valor_total: 28750.30, status: 'Pendente', tipo: 'Factura' },
          { id: 3, numero: 'VD003', data_emissao: '2024-01-13', cliente_nome: 'Supermercado Central', cliente_nuit: '456789123', valor_liquido: 7800.13, valor_iva: 1090.02, valor_total: 8890.15, status: 'Pago', tipo: 'Factura-Recibo' },
          { id: 4, numero: 'VD004', data_emissao: '2024-01-12', cliente_nome: 'Loja do João', cliente_nuit: '789123456', valor_liquido: 10826.09, valor_iva: 1513.91, valor_total: 12340.00, status: 'Pago', tipo: 'Factura' },
          { id: 5, numero: 'VD005', data_emissao: '2024-01-11', cliente_nome: 'Empresa DEF', cliente_nuit: '321654987', valor_liquido: 17413.04, valor_iva: 2437.71, valor_total: 19850.75, status: 'Pendente', tipo: 'Factura' }
        ],
        paginacao: {
          pagina_atual: 1,
          total_paginas: 3,
          total_registros: 25,
          registros_por_pagina: 10
        },
        analise_cotacoes: {
          total_cotacoes: 45,
          cotacoes_convertidas: 32,
          cotacoes_nao_convertidas: 13,
          taxa_conversao: 71.1
        },
        cotacoes_vencimento: [
          { id: 1, numero: 'COT001', cliente_nome: 'Cliente A', data_validade: '2024-01-20', valor_total: 15000.00 },
          { id: 2, numero: 'COT002', cliente_nome: 'Cliente B', data_validade: '2024-01-22', valor_total: 28500.00 },
          { id: 3, numero: 'COT003', cliente_nome: 'Cliente C', data_validade: '2024-01-25', valor_total: 12300.00 }
        ],
        motivos_nao_conversao: [
          { motivo: 'Preço alto', quantidade: 8 },
          { motivo: 'Prazo de entrega', quantidade: 3 },
          { motivo: 'Concorrência', quantidade: 2 }
        ]
      };

      // Calcular resumo dos dados
      const resumo = {
        total_vendas: relatoriosData.resumo.total_vendas,
        total_iva: relatoriosData.resumo.iva_total,
        total_liquido: relatoriosData.resumo.total_vendas - relatoriosData.resumo.iva_total,
        total_documentos: relatoriosData.resumo.total_facturas,
        ticket_medio: relatoriosData.resumo.ticket_medio,
        quantidade_vendas: relatoriosData.resumo.total_facturas,
        vendas_pagas: relatoriosData.resumo.total_facturas - 5,
        vendas_pendentes: 5
      };

      res.render('vendas/relatorios', {
        title: 'Relatórios de Vendas - SYNTRA ERP',
        layout: 'layouts/main',
        relatoriosData,
        resumo,
        vendas_por_tipo: relatoriosData.vendas_por_tipo,
        top_clientes: relatoriosData.top_clientes,
        top_artigos: relatoriosData.top_artigos,
        vendas_mensais: relatoriosData.vendas_mensais,
        vendas_detalhadas: relatoriosData.vendas_detalhadas,
        paginacao: relatoriosData.paginacao,
        analise_cotacoes: relatoriosData.analise_cotacoes,
        cotacoes_vencimento: relatoriosData.cotacoes_vencimento,
        motivos_nao_conversao: relatoriosData.motivos_nao_conversao,
        filters: { data_inicio, data_fim, cliente_id, tipo },
        filtros: { data_inicio, data_fim, cliente_id, tipo }
      });
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      req.flash('error', 'Erro ao carregar relatórios');
      res.redirect('/vendas');
    }
  }

  // Página de Factura-Recibo
  async facturaRecibo(req, res) {
    try {
      // Dados fictícios de facturas-recibo
      const facturasRecibo = [
        {
          id: 1,
          numero: 'FR2024/001',
          cliente: { nome: 'João Silva', nuit: '987654321' },
          valor_total: 1250.00,
          valor_iva: 210.00,
          data_emissao: new Date('2024-01-15'),
          status: 'Paga',
          forma_pagamento: 'Dinheiro'
        },
        {
          id: 2,
          numero: 'FR2024/002',
          cliente: { nome: 'Ana Costa', nuit: '456123789' },
          valor_total: 3500.00,
          valor_iva: 588.24,
          data_emissao: new Date('2024-01-14'),
          status: 'Paga',
          forma_pagamento: 'Transferência'
        }
      ];

      res.render('vendas/factura-recibo', {
        title: 'Factura-Recibo',
        facturasRecibo
      });
    } catch (error) {
      console.error('Erro ao carregar facturas-recibo:', error);
      req.flash('error', 'Erro ao carregar facturas-recibo');
      res.redirect('/vendas');
    }
  }

  // Página de Vendas a Crédito
  async vendasCredito(req, res) {
    try {
      // Dados fictícios de vendas a crédito
      const vendasCredito = [
        {
          id: 1,
          numero: 'VC2024/001',
          cliente: { nome: 'Empresa XYZ Lda', nuit: '789456123' },
          valor_total: 45000.00,
          valor_pago: 15000.00,
          valor_pendente: 30000.00,
          data_venda: new Date('2024-01-10'),
          data_vencimento: new Date('2024-03-10'),
          status: 'Pendente',
          dias_atraso: 0
        },
        {
          id: 2,
          numero: 'VC2024/002',
          cliente: { nome: 'Comércio ABC', nuit: '321654987' },
          valor_total: 12500.00,
          valor_pago: 5000.00,
          valor_pendente: 7500.00,
          data_venda: new Date('2023-12-15'),
          data_vencimento: new Date('2024-01-15'),
          status: 'Atrasado',
          dias_atraso: 25
        }
      ];

      res.render('vendas/vendas-credito', {
        title: 'Vendas a Crédito',
        vendasCredito
      });
    } catch (error) {
      console.error('Erro ao carregar vendas a crédito:', error);
      req.flash('error', 'Erro ao carregar vendas a crédito');
      res.redirect('/vendas');
    }
  }
}

module.exports = VendaController;