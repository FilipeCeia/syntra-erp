// ====================================
// src/controllers/artigos/ivaController.js
// ====================================
const { Iva } = require('../../models');
const { Op } = require('sequelize');

class IvaController {
  // Listar taxas de IVA (dados fictícios)
  async index(req, res) {
    try {
      const { page = 1, limit = 10, search = '', tipo = '', status = '' } = req.query;
      
      // Dados fictícios de taxas de IVA
      const taxasIvaFicticias = [
        {
          id: 1,
          codigo: 'IVA001',
          nome: 'IVA 17%',
          taxa: 17.00,
          tipo: 'normal',
          descricao: 'Taxa normal de IVA aplicada à maioria dos produtos',
          regime_tributario: 'geral',
          aplicacao_automatica: 1,
          data_inicio: new Date('2024-01-01'),
          data_fim: null,
          observacoes: 'Taxa padrão para produtos gerais',
          cor: '#fd7e14',
          status: 1,
          createdAt: new Date('2024-01-01')
        },
        {
          id: 2,
          codigo: 'IVA002',
          nome: 'IVA Isento',
          taxa: 0.00,
          tipo: 'isento',
          descricao: 'Produtos isentos de IVA',
          regime_tributario: 'geral',
          aplicacao_automatica: 0,
          data_inicio: new Date('2024-01-01'),
          data_fim: null,
          observacoes: 'Para produtos básicos e medicamentos',
          cor: '#6c757d',
          status: 1,
          createdAt: new Date('2024-01-01')
        },
        {
          id: 3,
          codigo: 'IVA003',
          nome: 'IVA 5%',
          taxa: 5.00,
          tipo: 'reduzida',
          descricao: 'Taxa reduzida para produtos essenciais',
          regime_tributario: 'geral',
          aplicacao_automatica: 0,
          data_inicio: new Date('2024-01-01'),
          data_fim: null,
          observacoes: 'Aplicada a produtos alimentares básicos',
          cor: '#28a745',
          status: 1,
          createdAt: new Date('2024-01-02')
        },
        {
          id: 4,
          codigo: 'IVA004',
          nome: 'IVA 10%',
          taxa: 10.00,
          tipo: 'intermediaria',
          descricao: 'Taxa intermediária para alguns serviços',
          regime_tributario: 'geral',
          aplicacao_automatica: 0,
          data_inicio: new Date('2024-01-01'),
          data_fim: null,
          observacoes: 'Para serviços específicos',
          cor: '#ffc107',
          status: 1,
          createdAt: new Date('2024-01-03')
        },
        {
          id: 5,
          codigo: 'IVA005',
          nome: 'IVA 25%',
          taxa: 25.00,
          tipo: 'especial',
          descricao: 'Taxa especial para produtos de luxo',
          regime_tributario: 'especial',
          aplicacao_automatica: 0,
          data_inicio: new Date('2024-01-01'),
          data_fim: new Date('2024-12-31'),
          observacoes: 'Aplicada temporariamente a produtos de luxo',
          cor: '#dc3545',
          status: 0,
          createdAt: new Date('2024-01-04')
        }
      ];

      // Filtrar taxas baseado na busca
      let taxasFiltradas = taxasIvaFicticias;
      if (search) {
        taxasFiltradas = taxasIvaFicticias.filter(taxa => 
          taxa.nome.toLowerCase().includes(search.toLowerCase()) ||
          taxa.codigo.toLowerCase().includes(search.toLowerCase()) ||
          (taxa.descricao && taxa.descricao.toLowerCase().includes(search.toLowerCase()))
        );
      }

      if (tipo) {
        taxasFiltradas = taxasFiltradas.filter(taxa => taxa.tipo === tipo);
      }

      if (status !== '') {
        taxasFiltradas = taxasFiltradas.filter(taxa => taxa.status == status);
      }

      // Paginação
      const totalItems = taxasFiltradas.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const taxasIva = taxasFiltradas.slice(startIndex, startIndex + parseInt(limit));

      res.render('artigos/iva/index', {
        title: 'IVA - SYNTRA ERP',
        layout: 'layouts/main',
        taxasIva,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          limit: parseInt(limit)
        },
        filters: {
          search,
          tipo,
          status
        }
      });
    } catch (error) {
      console.error('Erro ao listar taxas de IVA:', error);
      req.flash('error', 'Erro ao carregar taxas de IVA');
      res.redirect('/dashboard');
    }
  }

  // Exibir formulário de criação
  async create(req, res) {
    try {
      // Gerar próximo código
      const ultimaIva = await Iva.findOne({
        where: { client_id: req.session.user.client_id },
        order: [['id', 'DESC']]
      });

      const proximoNumero = ultimaIva ? ultimaIva.id + 1 : 1;
      const proximoCodigo = `IVA${proximoNumero.toString().padStart(3, '0')}`;

      res.render('artigos/iva/create', {
        title: 'Nova Taxa de IVA - SYNTRA ERP',
        layout: 'layouts/main',
        proximoCodigo
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de criação:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/iva');
    }
  }

  // Criar taxa de IVA
  async store(req, res) {
    try {
      const {
        nome,
        codigo,
        taxa,
        tipo,
        descricao,
        regime_tributario,
        aplicacao_automatica,
        data_inicio,
        data_fim,
        observacoes,
        status
      } = req.body;

      // Validações obrigatórias
      if (!nome || taxa === undefined || !tipo) {
        req.flash('error', 'Campos obrigatórios não preenchidos');
        return res.redirect('/iva/create');
      }

      // Validar taxa
      const taxaNum = parseFloat(taxa);
      if (isNaN(taxaNum) || taxaNum < 0 || taxaNum > 100) {
        req.flash('error', 'Taxa deve ser um número entre 0 e 100');
        return res.redirect('/iva/create');
      }

      // Verificar se código já existe
      if (codigo) {
        const ivaExistente = await Iva.findOne({
          where: {
            client_id: req.session.user.client_id,
            codigo
          }
        });

        if (ivaExistente) {
          req.flash('error', 'Código já existe');
          return res.redirect('/iva/create');
        }
      }

      // Gerar código se não fornecido
      let codigoFinal = codigo;
      if (!codigoFinal) {
        const ultimaIva = await Iva.findOne({
          where: { client_id: req.session.user.client_id },
          order: [['id', 'DESC']]
        });

        const proximoNumero = ultimaIva ? ultimaIva.id + 1 : 1;
        codigoFinal = `IVA${proximoNumero.toString().padStart(3, '0')}`;
      }

      // Criar taxa de IVA
      const novaIva = await Iva.create({
        client_id: req.session.user.client_id,
        nome,
        codigo: codigoFinal,
        taxa: taxaNum,
        tipo,
        descricao,
        regime_tributario: regime_tributario || 'geral',
        aplicacao_automatica: aplicacao_automatica === 'on' ? 1 : 0,
        data_inicio: data_inicio || new Date(),
        data_fim: data_fim || null,
        observacoes,
        cor: this.gerarCorPorTaxa(taxaNum),
        status: status === 'on' ? 1 : 0,
        user_id: req.session.user.id
      });

      req.flash('success', 'Taxa de IVA criada com sucesso');
      res.redirect(`/iva/${novaIva.id}`);
    } catch (error) {
      console.error('Erro ao criar taxa de IVA:', error);
      req.flash('error', 'Erro ao criar taxa de IVA');
      res.redirect('/iva/create');
    }
  }

  // Exibir taxa de IVA
  async show(req, res) {
    try {
      const { id } = req.params;
      const iva = await Iva.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!iva) {
        req.flash('error', 'Taxa de IVA não encontrada');
        return res.redirect('/iva');
      }

      res.render('artigos/iva/show', {
        title: 'Detalhes da Taxa de IVA - SYNTRA ERP',
        layout: 'layouts/main',
        iva
      });
    } catch (error) {
      console.error('Erro ao exibir taxa de IVA:', error);
      req.flash('error', 'Erro ao exibir taxa de IVA');
      res.redirect('/iva');
    }
  }

  // Editar taxa de IVA
  async edit(req, res) {
    try {
      const { id } = req.params;
      const iva = await Iva.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!iva) {
        req.flash('error', 'Taxa de IVA não encontrada');
        return res.redirect('/iva');
      }

      res.render('artigos/iva/edit', {
        title: 'Editar Taxa de IVA - SYNTRA ERP',
        layout: 'layouts/main',
        iva
      });
    } catch (error) {
      console.error('Erro ao carregar edição de taxa de IVA:', error);
      req.flash('error', 'Erro ao carregar edição de taxa de IVA');
      res.redirect('/iva');
    }
  }

  // Atualizar taxa de IVA
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        nome,
        codigo,
        taxa,
        tipo,
        descricao,
        regime_tributario,
        aplicacao_automatica,
        data_inicio,
        data_fim,
        observacoes,
        status
      } = req.body;

      const iva = await Iva.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!iva) {
        req.flash('error', 'Taxa de IVA não encontrada');
        return res.redirect('/iva');
      }

      // Validações
      if (!nome || taxa === undefined || !tipo) {
        req.flash('error', 'Campos obrigatórios não preenchidos');
        return res.redirect(`/iva/${id}/edit`);
      }

      const taxaNum = parseFloat(taxa);
      if (isNaN(taxaNum) || taxaNum < 0 || taxaNum > 100) {
        req.flash('error', 'Taxa deve ser um número entre 0 e 100');
        return res.redirect(`/iva/${id}/edit`);
      }

      // Verificar código duplicado
      if (codigo && codigo !== iva.codigo) {
        const ivaExistente = await Iva.findOne({
          where: {
            client_id: req.session.user.client_id,
            codigo,
            id: { [Op.ne]: id }
          }
        });

        if (ivaExistente) {
          req.flash('error', 'Código já existe');
          return res.redirect(`/iva/${id}/edit`);
        }
      }

      await iva.update({
        nome,
        codigo: codigo || iva.codigo,
        taxa: taxaNum,
        tipo,
        descricao,
        regime_tributario: regime_tributario || 'geral',
        aplicacao_automatica: aplicacao_automatica === 'on' ? 1 : 0,
        data_inicio: data_inicio || iva.data_inicio,
        data_fim: data_fim || null,
        observacoes,
        cor: this.gerarCorPorTaxa(taxaNum),
        status: status === 'on' ? 1 : 0
      });

      req.flash('success', 'Taxa de IVA atualizada com sucesso');
      res.redirect(`/iva/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar taxa de IVA:', error);
      req.flash('error', 'Erro ao atualizar taxa de IVA');
      res.redirect(`/iva/${req.params.id}/edit`);
    }
  }

  // Excluir taxa de IVA
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const iva = await Iva.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!iva) {
        return res.status(404).json({ success: false, message: 'Taxa de IVA não encontrada' });
      }

      await iva.destroy();
      res.json({ success: true, message: 'Taxa de IVA excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir taxa de IVA:', error);
      res.status(500).json({ success: false, message: 'Erro ao excluir taxa de IVA' });
    }
  }

  // Obter taxas ativas (API)
  async getTaxasAtivas(req, res) {
    try {
      const taxas = await Iva.findAll({
        where: {
          client_id: req.session.user.client_id,
          status: 1
        },
        order: [['taxa', 'ASC']]
      });

      res.json(taxas);
    } catch (error) {
      console.error('Erro ao buscar taxas ativas:', error);
      res.status(500).json({ error: 'Erro ao buscar taxas ativas' });
    }
  }

  // Duplicar taxa de IVA
  async duplicate(req, res) {
    try {
      const { id } = req.params;
      const ivaOriginal = await Iva.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!ivaOriginal) {
        return res.status(404).json({ success: false, message: 'Taxa de IVA não encontrada' });
      }

      // Gerar novo código
      const ultimaIva = await Iva.findOne({
        where: { client_id: req.session.user.client_id },
        order: [['id', 'DESC']]
      });

      const proximoNumero = ultimaIva ? ultimaIva.id + 1 : 1;
      const novoCodigo = `IVA${proximoNumero.toString().padStart(3, '0')}`;

      const novaIva = await Iva.create({
        client_id: ivaOriginal.client_id,
        nome: `${ivaOriginal.nome} (Cópia)`,
        codigo: novoCodigo,
        taxa: ivaOriginal.taxa,
        tipo: ivaOriginal.tipo,
        descricao: ivaOriginal.descricao,
        regime_tributario: ivaOriginal.regime_tributario,
        aplicacao_automatica: ivaOriginal.aplicacao_automatica,
        data_inicio: new Date(),
        data_fim: ivaOriginal.data_fim,
        observacoes: ivaOriginal.observacoes,
        cor: ivaOriginal.cor,
        status: 0, // Inativa por padrão
        user_id: req.session.user.id
      });

      res.json({ success: true, message: 'Taxa de IVA duplicada com sucesso', iva: novaIva });
    } catch (error) {
      console.error('Erro ao duplicar taxa de IVA:', error);
      res.status(500).json({ success: false, message: 'Erro ao duplicar taxa de IVA' });
    }
  }

  // Métodos auxiliares
  gerarCorPorTaxa(taxa) {
    if (taxa === 0) return '#6c757d'; // Cinza para isento
    if (taxa <= 5) return '#28a745'; // Verde para taxas baixas
    if (taxa <= 10) return '#ffc107'; // Amarelo para taxas médias
    if (taxa <= 20) return '#fd7e14'; // Laranja para taxas altas
    return '#dc3545'; // Vermelho para taxas muito altas
  }
}

module.exports = new IvaController();