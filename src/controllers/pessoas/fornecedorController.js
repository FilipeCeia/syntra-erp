// ====================================
// src/controllers/pessoas/fornecedorController.js
// ====================================
const { Fornecedor } = require('../../models');
const { Op } = require('sequelize');

// Listar fornecedores
exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const tipo = req.query.tipo || '';

    // Construir condições de busca
    const whereConditions = {
      client_id: req.session.user.client_id
    };

    if (search) {
      whereConditions[Op.or] = [
        { nome: { [Op.like]: `%${search}%` } },
        { nuit: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { telefone: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status) {
      whereConditions.status = status;
    }

    if (tipo) {
      whereConditions.tipo = tipo;
    }

    // Buscar fornecedores
    const { count, rows: fornecedores } = await Fornecedor.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Calcular estatísticas
    const totalFornecedores = await Fornecedor.count({
      where: { client_id: req.session.user.client_id }
    });

    const fornecedoresAtivos = await Fornecedor.count({
      where: {
        client_id: req.session.user.client_id,
        status: 1
      }
    });

    const fornecedoresBloqueados = await Fornecedor.count({
      where: {
        client_id: req.session.user.client_id,
        status: 0
      }
    });

    const totalPages = Math.ceil(count / limit);

    res.render('pessoas/fornecedores/index', {
      title: 'Fornecedores',
      fornecedores,
      currentPage: page,
      totalPages,
      totalItems: count,
      limit,
      search,
      status,
      tipo,
      stats: {
        total: totalFornecedores,
        ativos: fornecedoresAtivos,
        bloqueados: fornecedoresBloqueados
      }
    });
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    req.flash('error', 'Erro ao carregar fornecedores');
    res.redirect('/dashboard');
  }
};

// Exibir formulário de criação
exports.create = async (req, res) => {
  try {
    res.render('pessoas/fornecedores/create', {
      title: 'Novo Fornecedor'
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de criação:', error);
    req.flash('error', 'Erro ao carregar formulário');
    res.redirect('/pessoas/fornecedores');
  }
};

// Criar fornecedor
exports.store = async (req, res) => {
  try {
    const {
      nome,
      nuit,
      telefone,
      email,
      endereco,
      pessoa_contacto,
      telefone_contacto,
      condicoes_pagamento,
      prazo_pagamento,
      observacoes,
      regime_tributario,
      status,
      fornecedor_preferencial,
      aceita_devolucoes,
      numero_alvara
    } = req.body;

    // Validações básicas
    if (!nome || !nuit || !telefone || !email) {
      req.flash('error', 'Campos obrigatórios não preenchidos');
      return res.redirect('/pessoas/fornecedores/create');
    }

    // Verificar se NUIT já existe
    const fornecedorExistente = await Fornecedor.findOne({
      where: {
        client_id: req.session.user.client_id,
        nuit: nuit
      }
    });

    if (fornecedorExistente) {
      req.flash('error', 'Já existe um fornecedor com este NUIT');
      return res.redirect('/pessoas/fornecedores/create');
    }

    // Gerar código automático
    const ultimoFornecedor = await Fornecedor.findOne({
      where: { client_id: req.session.user.client_id },
      order: [['id', 'DESC']]
    });

    const proximoNumero = ultimoFornecedor ? ultimoFornecedor.id + 1 : 1;
    const codigo = `FOR${proximoNumero.toString().padStart(6, '0')}`;

    // Criar fornecedor
    const novoFornecedor = await Fornecedor.create({
      client_id: req.session.user.client_id,
      codigo,
      nome,
      nuit,
      telefone,
      email,
      endereco,
      pessoa_contacto,
      telefone_contacto,
      condicoes_pagamento,
      prazo_pagamento: prazo_pagamento || 30,
      observacoes,
      regime_tributario: regime_tributario || 'geral',
      status: status === 'on' ? 1 : 0,
      fornecedor_preferencial: fornecedor_preferencial === 'on' ? 1 : 0,
      aceita_devolucoes: aceita_devolucoes === 'on' ? 1 : 0,
      numero_alvara
    });

    req.flash('success', 'Fornecedor criado com sucesso');
    res.redirect(`/pessoas/fornecedores/${novoFornecedor.id}`);
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    req.flash('error', 'Erro ao criar fornecedor');
    res.redirect('/pessoas/fornecedores/create');
  }
};

// Exibir fornecedor
exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const fornecedor = await Fornecedor.findOne({
      where: {
        id,
        client_id: req.session.user.client_id
      }
    });

    if (!fornecedor) {
      req.flash('error', 'Fornecedor não encontrado');
      return res.redirect('/pessoas/fornecedores');
    }

    res.render('pessoas/fornecedores/show', {
      title: `Fornecedor - ${fornecedor.nome}`,
      fornecedor
    });
  } catch (error) {
    console.error('Erro ao exibir fornecedor:', error);
    req.flash('error', 'Erro ao carregar fornecedor');
    res.redirect('/pessoas/fornecedores');
  }
};

// Exibir formulário de edição
exports.edit = async (req, res) => {
  try {
    const { id } = req.params;

    const fornecedor = await Fornecedor.findOne({
      where: {
        id,
        client_id: req.session.user.client_id
      }
    });

    if (!fornecedor) {
      req.flash('error', 'Fornecedor não encontrado');
      return res.redirect('/pessoas/fornecedores');
    }

    res.render('pessoas/fornecedores/edit', {
      title: `Editar - ${fornecedor.nome}`,
      fornecedor
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de edição:', error);
    req.flash('error', 'Erro ao carregar formulário');
    res.redirect('/pessoas/fornecedores');
  }
};

// Atualizar fornecedor
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      nuit,
      telefone,
      email,
      endereco,
      pessoa_contacto,
      telefone_contacto,
      condicoes_pagamento,
      prazo_pagamento,
      observacoes,
      regime_tributario,
      status,
      fornecedor_preferencial,
      aceita_devolucoes,
      numero_alvara
    } = req.body;

    const fornecedor = await Fornecedor.findOne({
      where: {
        id,
        client_id: req.session.user.client_id
      }
    });

    if (!fornecedor) {
      req.flash('error', 'Fornecedor não encontrado');
      return res.redirect('/pessoas/fornecedores');
    }

    // Verificar se NUIT já existe (exceto o próprio fornecedor)
    if (nuit !== fornecedor.nuit) {
      const fornecedorExistente = await Fornecedor.findOne({
        where: {
          client_id: req.session.user.client_id,
          nuit: nuit,
          id: { [Op.ne]: id }
        }
      });

      if (fornecedorExistente) {
        req.flash('error', 'Já existe um fornecedor com este NUIT');
        return res.redirect(`/pessoas/fornecedores/${id}/edit`);
      }
    }

    // Atualizar fornecedor
    await fornecedor.update({
      nome,
      nuit,
      telefone,
      email,
      endereco,
      pessoa_contacto,
      telefone_contacto,
      condicoes_pagamento,
      prazo_pagamento: prazo_pagamento || 30,
      observacoes,
      regime_tributario: regime_tributario || 'geral',
      status: status === 'on' ? 1 : 0,
      fornecedor_preferencial: fornecedor_preferencial === 'on' ? 1 : 0,
      aceita_devolucoes: aceita_devolucoes === 'on' ? 1 : 0,
      numero_alvara
    });

    req.flash('success', 'Fornecedor atualizado com sucesso');
    res.redirect(`/pessoas/fornecedores/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    req.flash('error', 'Erro ao atualizar fornecedor');
    res.redirect(`/pessoas/fornecedores/${req.params.id}/edit`);
  }
};

// Excluir fornecedor
exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const fornecedor = await Fornecedor.findOne({
      where: {
        id,
        client_id: req.session.user.client_id
      }
    });

    if (!fornecedor) {
      req.flash('error', 'Fornecedor não encontrado');
      return res.redirect('/pessoas/fornecedores');
    }

    await fornecedor.destroy();

    req.flash('success', 'Fornecedor excluído com sucesso');
    res.redirect('/pessoas/fornecedores');
  } catch (error) {
    console.error('Erro ao excluir fornecedor:', error);
    req.flash('error', 'Erro ao excluir fornecedor');
    res.redirect('/pessoas/fornecedores');
  }
};

// Exportar fornecedores
exports.export = async (req, res) => {
  try {
    const { formato } = req.query;
    
    const fornecedores = await Fornecedor.findAll({
      where: { client_id: req.session.user.client_id },
      order: [['nome', 'ASC']]
    });

    if (formato === 'excel') {
      // Implementar exportação para Excel
      res.json({ message: 'Exportação Excel em desenvolvimento', fornecedores });
    } else if (formato === 'csv') {
      // Implementar exportação para CSV
      res.json({ message: 'Exportação CSV em desenvolvimento', fornecedores });
    } else if (formato === 'pdf') {
      // Implementar exportação para PDF
      res.json({ message: 'Exportação PDF em desenvolvimento', fornecedores });
    } else {
      res.json({ fornecedores });
    }
  } catch (error) {
    console.error('Erro ao exportar fornecedores:', error);
    res.status(500).json({ error: 'Erro ao exportar fornecedores' });
  }
};

// Importar fornecedores
exports.import = async (req, res) => {
  try {
    // Implementar importação de fornecedores
    res.json({ message: 'Importação em desenvolvimento' });
  } catch (error) {
    console.error('Erro ao importar fornecedores:', error);
    res.status(500).json({ error: 'Erro ao importar fornecedores' });
  }
};