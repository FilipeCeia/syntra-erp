// ====================================
// src/controllers/vendas/cotacaoController.js
// ====================================
const { Cotacao, Cliente, Artigo } = require('../../models');
const { Op } = require('sequelize');

class CotacaoController {
  // Listar cotações
  async index(req, res) {
    try {
      const { page = 1, search = '', status = '', cliente_id = '' } = req.query;
      const limit = 10;
      const offset = (page - 1) * limit;

      // Dados fictícios de cotações
      const cotacoes = [
        {
          id: 1,
          numero: 'CT2024/001',
          cliente: {
            id: 1,
            nome: 'Empresa ABC Lda',
            nuit: '123456789',
            email: 'contato@empresaabc.co.mz'
          },
          data_emissao: new Date('2024-01-10'),
          data_criacao: new Date('2024-01-10'),
          data_validade: new Date('2024-02-10'),
          valor_total: 45750.00,
          status: 'Ativa',
          dias_restantes: 15,
          observacoes: 'Proposta para equipamentos de escritório',
          convertida: false
        },
        {
          id: 2,
          numero: 'CT2024/002',
          cliente: {
            id: 2,
            nome: 'Construtora XYZ',
            nuit: '987654321',
            email: 'vendas@construtoraXYZ.co.mz'
          },
          data_emissao: new Date('2024-01-08'),
          data_criacao: new Date('2024-01-08'),
          data_validade: new Date('2024-01-25'),
          valor_total: 125430.50,
          status: 'Convertida',
          dias_restantes: 0,
          observacoes: 'Material de construção - Projeto Fase 1',
          convertida: true,
          factura_numero: 'FT2024/001'
        },
        {
          id: 3,
          numero: 'CT2024/003',
          cliente: {
            id: 3,
            nome: 'Supermercado Central',
            nuit: '456789123',
            email: 'compras@supercentral.co.mz'
          },
          data_emissao: new Date('2024-01-05'),
          data_criacao: new Date('2024-01-05'),
          data_validade: new Date('2024-01-20'),
          valor_total: 8750.20,
          status: 'Expirada',
          dias_restantes: -5,
          observacoes: 'Equipamentos de refrigeração',
          convertida: false
        },
        {
          id: 4,
          numero: 'CT2024/004',
          cliente: {
            id: 4,
            nome: 'Escola Primária Unidade',
            nuit: '147258369',
            email: 'direcao@escolaunidade.co.mz'
          },
          data_emissao: new Date('2024-01-12'),
          data_criacao: new Date('2024-01-12'),
          data_validade: new Date('2024-02-12'),
          valor_total: 32150.75,
          status: 'Ativa',
          dias_restantes: 17,
          observacoes: 'Material didático e mobiliário escolar',
          convertida: false
        }
      ];

      const totalCotacoes = cotacoes.length;
      const totalPages = Math.ceil(totalCotacoes / limit);

      res.render('vendas/cotacoes/index', {
        title: 'Cotações - SYNTRA ERP',
        layout: 'layouts/main',
        cotacoes,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalCotacoes,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: { search, status, cliente_id }
      });
    } catch (error) {
      console.error('Erro ao listar cotações:', error);
      req.flash('error', 'Erro ao carregar cotações');
      res.redirect('/vendas');
    }
  }

  // Formulário de criação de cotação
  async create(req, res) {
    try {
      // Dados fictícios para o formulário
      const clientes = [
        { id: 1, nome: 'Empresa ABC Lda', nuit: '123456789', email: 'contato@empresaabc.co.mz' },
        { id: 2, nome: 'Construtora XYZ', nuit: '987654321', email: 'vendas@construtoraXYZ.co.mz' },
        { id: 3, nome: 'Supermercado Central', nuit: '456789123', email: 'compras@supercentral.co.mz' },
        { id: 4, nome: 'Escola Primária Unidade', nuit: '147258369', email: 'direcao@escolaunidade.co.mz' },
        { id: 5, nome: 'Clínica Saúde Total', nuit: '369258147', email: 'administracao@saudetotal.co.mz' }
      ];

      const artigos = [
        {
          id: 1,
          codigo: 'ART001',
          nome: 'Smartphone Samsung A54',
          preco_venda: 15000.00,
          unidade: 'UN',
          stock_atual: 25
        },
        {
          id: 2,
          codigo: 'ART002',
          nome: 'Notebook Lenovo ThinkPad',
          preco_venda: 45000.00,
          unidade: 'UN',
          stock_atual: 8
        },
        {
          id: 3,
          codigo: 'ART003',
          nome: 'Impressora HP LaserJet',
          preco_venda: 12500.00,
          unidade: 'UN',
          stock_atual: 15
        },
        {
          id: 4,
          codigo: 'ART004',
          nome: 'Mesa de Escritório',
          preco_venda: 8750.00,
          unidade: 'UN',
          stock_atual: 12
        }
      ];

      // Próximo número sequencial
      const proximoNumero = 'CT2024/005';

      res.render('vendas/cotacoes/create', {
        title: 'Nova Cotação - SYNTRA ERP',
        layout: 'layouts/main',
        clientes,
        artigos,
        proximoNumero,
        validadePadrao: 30 // dias
      });
    } catch (error) {
      console.error('Erro ao carregar formulário de cotação:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/vendas/cotacoes');
    }
  }

  // Salvar nova cotação
  async store(req, res) {
    try {
      const {
        cliente_id,
        data_emissao,
        data_validade,
        observacoes,
        itens
      } = req.body;

      // Simulação de criação de cotação
      const novaCotacao = {
        id: 5,
        numero: 'CT2024/005',
        cliente_id: parseInt(cliente_id),
        data_emissao: new Date(data_emissao),
        data_validade: new Date(data_validade),
        observacoes,
        status: 'Ativa',
        valor_total: 0 // Será calculado com base nos itens
      };

      req.flash('success', `Cotação ${novaCotacao.numero} criada com sucesso!`);
      res.redirect(`/vendas/cotacoes/${novaCotacao.id}`);
    } catch (error) {
      console.error('Erro ao criar cotação:', error);
      req.flash('error', 'Erro ao criar cotação');
      res.redirect('/vendas/cotacoes/create');
    }
  }

  // Exibir detalhes da cotação
  async show(req, res) {
    try {
      const { id } = req.params;

      // Dados fictícios de uma cotação específica
      const cotacao = {
        id: parseInt(id),
        numero: 'CT2024/001',
        cliente: {
          nome: 'Empresa ABC Lda',
          nuit: '123456789',
          email: 'contato@empresaabc.co.mz',
          telefone: '+258 21 123 456',
          endereco: 'Av. Julius Nyerere, 123, Maputo'
        },
        data_emissao: new Date('2024-01-10'),
        data_criacao: new Date('2024-01-10'),
        data_validade: new Date('2024-02-10'),
        dias_restantes: 15,
        moeda: 'MZN',
        itens: [
          {
            id: 1,
            artigo: {
              codigo: 'ART001',
              nome: 'Smartphone Samsung A54',
              unidade: 'UN'
            },
            quantidade: 3,
            preco_unitario: 15000.00,
            desconto_percentual: 10.0,
            desconto_valor: 4500.00,
            subtotal: 40500.00,
            total: 40500.00
          },
          {
            id: 2,
            artigo: {
              codigo: 'ART003',
              nome: 'Impressora HP LaserJet',
              unidade: 'UN'
            },
            quantidade: 1,
            preco_unitario: 12500.00,
            desconto_percentual: 5.0,
            desconto_valor: 625.00,
            subtotal: 11875.00,
            total: 11875.00
          }
        ],
        subtotal: 52375.00,
        desconto_total: 5125.00,
        valor_total: 47250.00,
        status: 'Ativa',
        observacoes: 'Proposta para equipamentos de escritório. Preços válidos por 30 dias.',
        convertida: false,
        historico: [
          {
            data: new Date('2024-01-10'),
            acao: 'Criada',
            usuario: 'João Silva',
            observacao: 'Cotação criada pelo vendedor'
          },
          {
            data: new Date('2024-01-12'),
            acao: 'Enviada',
            usuario: 'João Silva',
            observacao: 'Cotação enviada por email para o cliente'
          }
        ]
      };

      res.render('vendas/cotacoes/show', {
        title: `Cotação ${cotacao.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        cotacao
      });
    } catch (error) {
      console.error('Erro ao exibir cotação:', error);
      req.flash('error', 'Cotação não encontrada');
      res.redirect('/vendas/cotacoes');
    }
  }

  // Formulário de edição
  async edit(req, res) {
    try {
      const { id } = req.params;

      // Dados fictícios da cotação para edição
      const cotacao = {
        id: parseInt(id),
        numero: 'CT2024/001',
        cliente_id: 1,
        data_emissao: '2024-01-10',
        data_validade: '2024-02-10',
        observacoes: 'Proposta para equipamentos de escritório',
        status: 'Ativa'
      };

      const clientes = [
        { id: 1, nome: 'Empresa ABC Lda', nuit: '123456789' },
        { id: 2, nome: 'Construtora XYZ', nuit: '987654321' },
        { id: 3, nome: 'Supermercado Central', nuit: '456789123' }
      ];

      res.render('vendas/cotacoes/edit', {
        title: `Editar Cotação ${cotacao.numero} - SYNTRA ERP`,
        layout: 'layouts/main',
        cotacao,
        clientes
      });
    } catch (error) {
      console.error('Erro ao carregar edição de cotação:', error);
      req.flash('error', 'Cotação não encontrada');
      res.redirect('/vendas/cotacoes');
    }
  }

  // Atualizar cotação
  async update(req, res) {
    try {
      const { id } = req.params;
      const { cliente_id, data_validade, observacoes } = req.body;

      // Simulação de atualização
      req.flash('success', 'Cotação atualizada com sucesso!');
      res.redirect(`/vendas/cotacoes/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar cotação:', error);
      req.flash('error', 'Erro ao atualizar cotação');
      res.redirect(`/vendas/cotacoes/${req.params.id}/edit`);
    }
  }

  // Converter cotação em factura
  async converter(req, res) {
    try {
      const { id } = req.params;

      // Simulação de conversão
      const novaFactura = {
        id: 5,
        numero: 'FT2024/005',
        cotacao_id: parseInt(id)
      };

      req.flash('success', `Cotação convertida em Factura ${novaFactura.numero} com sucesso!`);
      res.redirect(`/vendas/facturas/${novaFactura.id}`);
    } catch (error) {
      console.error('Erro ao converter cotação:', error);
      req.flash('error', 'Erro ao converter cotação');
      res.redirect(`/vendas/cotacoes/${id}`);
    }
  }

  // Cancelar cotação
  async cancelar(req, res) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      // Simulação de cancelamento
      req.flash('success', 'Cotação cancelada com sucesso!');
      res.redirect(`/vendas/cotacoes/${id}`);
    } catch (error) {
      console.error('Erro ao cancelar cotação:', error);
      req.flash('error', 'Erro ao cancelar cotação');
      res.redirect(`/vendas/cotacoes/${id}`);
    }
  }

  // Enviar cotação por email
  async enviar(req, res) {
    try {
      const { id } = req.params;
      const { email, mensagem } = req.body;

      // Simulação de envio por email
      req.flash('success', 'Cotação enviada por email com sucesso!');
      res.redirect(`/vendas/cotacoes/${id}`);
    } catch (error) {
      console.error('Erro ao enviar cotação:', error);
      req.flash('error', 'Erro ao enviar cotação');
      res.redirect(`/vendas/cotacoes/${id}`);
    }
  }

  // Imprimir cotação
  async imprimir(req, res) {
    try {
      const { id } = req.params;

      // Dados da cotação para impressão
      const cotacao = {
        numero: 'CT2024/001',
        data_emissao: new Date('2024-01-10'),
        data_validade: new Date('2024-02-10'),
        cliente: {
          nome: 'Empresa ABC Lda',
          nuit: '123456789',
          endereco: 'Av. Julius Nyerere, 123, Maputo'
        },
        valor_total: 47250.00,
        observacoes: 'Proposta válida por 30 dias'
      };

      res.render('vendas/cotacoes/print', {
        title: `Imprimir Cotação ${cotacao.numero}`,
        layout: 'layouts/print',
        cotacao
      });
    } catch (error) {
      console.error('Erro ao imprimir cotação:', error);
      req.flash('error', 'Erro ao imprimir cotação');
      res.redirect(`/vendas/cotacoes/${id}`);
    }
  }

  // Imprimir cotação
  async print(req, res) {
    try {
      const { id } = req.params;

      // Dados da cotação para impressão
      const cotacao = {
        numero: 'CT2024/001',
        data_emissao: new Date('2024-01-10'),
        validade: new Date('2024-02-10'),
        cliente: {
          nome: 'Empresa ABC Lda',
          nuit: '123456789',
          endereco: 'Av. Julius Nyerere, 123, Maputo'
        },
        valor_total: 47250.00
      };

      res.render('vendas/cotacoes/print', {
        title: `Imprimir Cotação ${cotacao.numero}`,
        layout: 'layouts/print',
        cotacao
      });
    } catch (error) {
      console.error('Erro ao imprimir cotação:', error);
      req.flash('error', 'Erro ao imprimir cotação');
      res.redirect(`/vendas/cotacoes/${id}`);
    }
  }

  // Relatório de cotações não convertidas
  async relatoriosNaoConvertidas(req, res) {
    try {
      const { data_inicio = '', data_fim = '', cliente_id = '' } = req.query;

      // Dados fictícios de cotações não convertidas
      const cotacoesNaoConvertidas = [
        {
          numero: 'CT2024/001',
          cliente: 'Empresa ABC Lda',
          data_emissao: new Date('2024-01-10'),
          data_validade: new Date('2024-02-10'),
          valor_total: 47250.00,
          dias_restantes: 15,
          motivo_provavel: 'Aguardando aprovação interna'
        },
        {
          numero: 'CT2024/003',
          cliente: 'Supermercado Central',
          data_emissao: new Date('2024-01-05'),
          data_validade: new Date('2024-01-20'),
          valor_total: 8750.20,
          dias_restantes: -5,
          motivo_provavel: 'Cotação expirada - preço alto'
        },
        {
          numero: 'CT2024/004',
          cliente: 'Escola Primária Unidade',
          data_emissao: new Date('2024-01-12'),
          data_validade: new Date('2024-02-12'),
          valor_total: 32150.75,
          dias_restantes: 17,
          motivo_provavel: 'Aguardando orçamento do governo'
        }
      ];

      const resumo = {
        total_cotacoes: cotacoesNaoConvertidas.length,
        valor_total: cotacoesNaoConvertidas.reduce((sum, c) => sum + c.valor_total, 0),
        ativas: cotacoesNaoConvertidas.filter(c => c.dias_restantes > 0).length,
        expiradas: cotacoesNaoConvertidas.filter(c => c.dias_restantes <= 0).length
      };

      res.render('vendas/cotacoes/nao-convertidas', {
        title: 'Cotações Não Convertidas - SYNTRA ERP',
        layout: 'layouts/main',
        cotacoesNaoConvertidas,
        resumo,
        filters: { data_inicio, data_fim, cliente_id }
      });
    } catch (error) {
      console.error('Erro ao gerar relatório de cotações não convertidas:', error);
      req.flash('error', 'Erro ao carregar relatório');
      res.redirect('/vendas/cotacoes');
    }
  }

  // Histórico de cotações por cliente
  async historicoPorCliente(req, res) {
    try {
      const { cliente_id } = req.params;

      // Dados fictícios do histórico
      const cliente = {
        id: parseInt(cliente_id),
        nome: 'Empresa ABC Lda',
        nuit: '123456789'
      };

      const historico = [
        {
          numero: 'CT2024/001',
          data_emissao: new Date('2024-01-10'),
          valor_total: 47250.00,
          status: 'Ativa',
          convertida: false
        },
        {
          numero: 'CT2023/045',
          data_emissao: new Date('2023-12-15'),
          valor_total: 25430.50,
          status: 'Convertida',
          convertida: true,
          factura_numero: 'FT2023/089'
        },
        {
          numero: 'CT2023/032',
          data_emissao: new Date('2023-11-20'),
          valor_total: 18750.75,
          status: 'Expirada',
          convertida: false
        }
      ];

      const estatisticas = {
        total_cotacoes: historico.length,
        convertidas: historico.filter(h => h.convertida).length,
        valor_total: historico.reduce((sum, h) => sum + h.valor_total, 0),
        taxa_conversao: (historico.filter(h => h.convertida).length / historico.length * 100).toFixed(1)
      };

      res.render('vendas/cotacoes/historico-cliente', {
        title: `Histórico de Cotações - ${cliente.nome} - SYNTRA ERP`,
        layout: 'layouts/main',
        cliente,
        historico,
        estatisticas
      });
    } catch (error) {
      console.error('Erro ao carregar histórico de cotações:', error);
      req.flash('error', 'Erro ao carregar histórico');
      res.redirect('/vendas/cotacoes');
    }
  }
}

module.exports = CotacaoController;