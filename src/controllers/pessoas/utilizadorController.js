// ====================================
// src/controllers/pessoas/utilizadorController.js
// ====================================
const { User } = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');


exports.index = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', perfil = '', status = '', loja = '' } = req.query;
    const offset = (page - 1) * limit;

    // Dados fictícios para utilizadores
    const utilizadoresFicticios = [
      {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@syntra.co.mz',
        perfil: 'Administrador',
        loja: 'Loja Centro',
        status: 1,
        ultimo_login: new Date('2024-01-15 10:30:00'),
        createdAt: new Date('2023-01-15')
      },
      {
        id: 2,
        nome: 'Maria Santos',
        email: 'maria.santos@syntra.co.mz',
        perfil: 'Vendedor',
        loja: 'Loja Shopping',
        status: 1,
        ultimo_login: new Date('2024-01-15 09:15:00'),
        createdAt: new Date('2023-02-20')
      },
      {
        id: 3,
        nome: 'Carlos Mendes',
        email: 'carlos.mendes@syntra.co.mz',
        perfil: 'Gerente',
        loja: 'Loja Centro',
        status: 1,
        ultimo_login: new Date('2024-01-15 08:45:00'),
        createdAt: new Date('2023-03-10')
      },
      {
        id: 4,
        nome: 'Ana Costa',
        email: 'ana.costa@syntra.co.mz',
        perfil: 'Vendedor',
        loja: 'Loja Aeroporto',
        status: 0,
        ultimo_login: new Date('2024-01-10 16:20:00'),
        createdAt: new Date('2023-04-05')
      },
      {
        id: 5,
        nome: 'Pedro Oliveira',
        email: 'pedro.oliveira@syntra.co.mz',
        perfil: 'Supervisor',
        loja: 'Loja Shopping',
        status: 1,
        ultimo_login: new Date('2024-01-15 11:00:00'),
        createdAt: new Date('2023-05-15')
      }
    ];

    // Filtrar dados fictícios baseado nos parâmetros de busca
    let utilizadoresFiltrados = utilizadoresFicticios;
    
    if (search) {
      utilizadoresFiltrados = utilizadoresFiltrados.filter(user => 
        user.nome.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (perfil) {
      utilizadoresFiltrados = utilizadoresFiltrados.filter(user => user.perfil === perfil);
    }
    
    if (status !== '') {
      utilizadoresFiltrados = utilizadoresFiltrados.filter(user => user.status == status);
    }
    
    if (loja) {
      utilizadoresFiltrados = utilizadoresFiltrados.filter(user => user.loja === loja);
    }

    // Paginação
    const count = utilizadoresFiltrados.length;
    const utilizadores = utilizadoresFiltrados.slice(offset, offset + parseInt(limit));
    
    // Estatísticas fictícias
    const totalUtilizadores = utilizadoresFicticios.length;
    const utilizadoresAtivos = utilizadoresFicticios.filter(u => u.status === 1).length;
    const utilizadoresOnline = 3; // Simulando usuários online
    const totalPerfis = [...new Set(utilizadoresFicticios.map(u => u.perfil))].length;
    
    const totalPages = Math.ceil(count / limit);

    res.render('pessoas/utilizadores/index', {
      title: 'Utilizadores',
      utilizadores,
      currentPage: parseInt(page),
      totalPages,
      totalItems: count,
      limit: parseInt(limit),
      search,
      perfil,
      status,
      loja,
      stats: {
        total: totalUtilizadores,
        ativos: utilizadoresAtivos,
        online: utilizadoresOnline,
        perfis: totalPerfis
      }
    });
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error);
    req.flash('error', 'Erro ao carregar utilizadores');
    res.redirect('/dashboard');
  }
};

// Exibir formulário de criação
exports.create = async (req, res) => {
  try {
    res.render('pessoas/utilizadores/create', {
      title: 'Novo Utilizador'
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de criação:', error);
    req.flash('error', 'Erro ao carregar formulário');
    res.redirect('/pessoas/utilizadores');
  }
};

// Criar utilizador
exports.store = async (req, res) => {
  try {
    const {
      nome,
      email,
      codigo,
      telefone,
      password,
      confirm_password,
      perfil,
      permissoes_vendas,
      permissoes_stock,
      permissoes_relatorios,
      permissoes_configuracoes,
      lojas_acesso,
      status,
      notificacoes,
      relatorios_email,
      observacoes,
      enviar_credenciais,
      forcar_mudanca_senha
    } = req.body;

    // Validações básicas
    if (!nome || !email || !password) {
      req.flash('error', 'Campos obrigatórios não preenchidos');
      return res.redirect('/pessoas/utilizadores/create');
    }

    if (password !== confirm_password) {
      req.flash('error', 'As senhas não coincidem');
      return res.redirect('/pessoas/utilizadores/create');
    }

    // Verificar se email já existe
    const utilizadorExistente = await User.findOne({
      where: {
        client_id: req.session.user.client_id,
        email: email
      }
    });

    if (utilizadorExistente) {
      req.flash('error', 'Já existe um utilizador com este email');
      return res.redirect('/pessoas/utilizadores/create');
    }

    // Gerar código automático se não fornecido
    let codigoFinal = codigo;
    if (!codigoFinal) {
      const ultimoUtilizador = await User.findOne({
        where: { client_id: req.session.user.client_id },
        order: [['id', 'DESC']]
      });

      const proximoNumero = ultimoUtilizador ? ultimoUtilizador.id + 1 : 1;
      codigoFinal = `USR${proximoNumero.toString().padStart(6, '0')}`;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Preparar permissões
    const permissoes = {
      vendas: permissoes_vendas || [],
      stock: permissoes_stock || [],
      relatorios: permissoes_relatorios || [],
      configuracoes: permissoes_configuracoes || []
    };

    // Criar utilizador
    const novoUtilizador = await User.create({
      client_id: req.session.user.client_id,
      codigo: codigoFinal,
      nome,
      email,
      telefone,
      password: hashedPassword,
      perfil: perfil || 'operador',
      permissoes: JSON.stringify(permissoes),
      lojas_acesso: Array.isArray(lojas_acesso) ? lojas_acesso.join(',') : lojas_acesso,
      status: status === 'on' ? 1 : 0,
      notificacoes: notificacoes === 'on' ? 1 : 0,
      relatorios_email: relatorios_email === 'on' ? 1 : 0,
      observacoes,
      forcar_mudanca_senha: forcar_mudanca_senha === 'on' ? 1 : 0
    });

    // Enviar credenciais por email se solicitado
    if (enviar_credenciais === 'on') {
      // Implementar envio de email
      console.log('Enviar credenciais para:', email);
    }

    req.flash('success', 'Utilizador criado com sucesso');
    res.redirect(`/pessoas/utilizadores/${novoUtilizador.id}`);
  } catch (error) {
    console.error('Erro ao criar utilizador:', error);
    req.flash('error', 'Erro ao criar utilizador');
    res.redirect('/pessoas/utilizadores/create');
  }
};

// Exibir utilizador
exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const utilizador = await User.findOne({
      where: {
        id,
        client_id: req.session.user.client_id
      },
      attributes: { exclude: ['password'] }
    });

    if (!utilizador) {
      req.flash('error', 'Utilizador não encontrado');
      return res.redirect('/pessoas/utilizadores');
    }

    res.render('pessoas/utilizadores/show', {
      title: `Utilizador - ${utilizador.nome}`,
      utilizador
    });
  } catch (error) {
    console.error('Erro ao exibir utilizador:', error);
    req.flash('error', 'Erro ao carregar utilizador');
    res.redirect('/pessoas/utilizadores');
  }
};

// Exibir formulário de edição
exports.edit = async (req, res) => {
  try {
    const { id } = req.params;

    const utilizador = await User.findOne({
      where: {
        id,
        client_id: req.session.user.client_id
      },
      attributes: { exclude: ['password'] }
    });

    if (!utilizador) {
      req.flash('error', 'Utilizador não encontrado');
      return res.redirect('/pessoas/utilizadores');
    }

    res.render('pessoas/utilizadores/edit', {
      title: `Editar - ${utilizador.nome}`,
      utilizador
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de edição:', error);
    req.flash('error', 'Erro ao carregar formulário');
    res.redirect('/pessoas/utilizadores');
  }
};

// Atualizar utilizador
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      email,
      telefone,
      password,
      confirm_password,
      perfil,
      permissoes_vendas,
      permissoes_stock,
      permissoes_relatorios,
      permissoes_configuracoes,
      lojas_acesso,
      status,
      notificacoes,
      relatorios_email,
      observacoes
    } = req.body;

    const utilizador = await User.findOne({
      where: {
        id,
        client_id: req.session.user.client_id
      }
    });

    if (!utilizador) {
      req.flash('error', 'Utilizador não encontrado');
      return res.redirect('/pessoas/utilizadores');
    }

    // Verificar se email já existe (exceto o próprio utilizador)
    if (email !== utilizador.email) {
      const utilizadorExistente = await User.findOne({
        where: {
          client_id: req.session.user.client_id,
          email: email,
          id: { [Op.ne]: id }
        }
      });

      if (utilizadorExistente) {
        req.flash('error', 'Já existe um utilizador com este email');
        return res.redirect(`/pessoas/utilizadores/${id}/edit`);
      }
    }

    // Preparar dados para atualização
    const dadosAtualizacao = {
      nome,
      email,
      telefone,
      perfil: perfil || 'operador',
      permissoes: JSON.stringify({
        vendas: permissoes_vendas || [],
        stock: permissoes_stock || [],
        relatorios: permissoes_relatorios || [],
        configuracoes: permissoes_configuracoes || []
      }),
      lojas_acesso: Array.isArray(lojas_acesso) ? lojas_acesso.join(',') : lojas_acesso,
      status: status === 'on' ? 1 : 0,
      notificacoes: notificacoes === 'on' ? 1 : 0,
      relatorios_email: relatorios_email === 'on' ? 1 : 0,
      observacoes
    };

    // Atualizar senha se fornecida
    if (password && password.trim() !== '') {
      if (password !== confirm_password) {
        req.flash('error', 'As senhas não coincidem');
        return res.redirect(`/pessoas/utilizadores/${id}/edit`);
      }
      dadosAtualizacao.password = await bcrypt.hash(password, 10);
    }

    // Atualizar utilizador
    await utilizador.update(dadosAtualizacao);

    req.flash('success', 'Utilizador atualizado com sucesso');
    res.redirect(`/pessoas/utilizadores/${id}`);
  } catch (error) {
    console.error('Erro ao atualizar utilizador:', error);
    req.flash('error', 'Erro ao atualizar utilizador');
    res.redirect(`/pessoas/utilizadores/${req.params.id}/edit`);
  }
};

// Excluir utilizador
exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const utilizador = await User.findOne({
      where: {
        id,
        client_id: req.session.user.client_id
      }
    });

    if (!utilizador) {
      req.flash('error', 'Utilizador não encontrado');
      return res.redirect('/pessoas/utilizadores');
    }

    // Não permitir excluir o próprio utilizador
    if (utilizador.id === req.session.user.id) {
      req.flash('error', 'Não é possível excluir o próprio utilizador');
      return res.redirect('/pessoas/utilizadores');
    }

    await utilizador.destroy();

    req.flash('success', 'Utilizador excluído com sucesso');
    res.redirect('/pessoas/utilizadores');
  } catch (error) {
    console.error('Erro ao excluir utilizador:', error);
    req.flash('error', 'Erro ao excluir utilizador');
    res.redirect('/pessoas/utilizadores');
  }
};

// Bloquear/Desbloquear utilizador
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const utilizador = await User.findOne({
      where: {
        id,
        client_id: req.session.user.client_id
      }
    });

    if (!utilizador) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    // Não permitir bloquear o próprio utilizador
    if (utilizador.id === req.session.user.id) {
      return res.status(400).json({ error: 'Não é possível bloquear o próprio utilizador' });
    }

    const novoStatus = utilizador.status === 1 ? 0 : 1;
    await utilizador.update({ status: novoStatus });

    const acao = novoStatus === 1 ? 'desbloqueado' : 'bloqueado';
    res.json({ 
      success: true, 
      message: `Utilizador ${acao} com sucesso`,
      status: novoStatus
    });
  } catch (error) {
    console.error('Erro ao alterar status do utilizador:', error);
    res.status(500).json({ error: 'Erro ao alterar status do utilizador' });
  }
};

// Resetar senha
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { nova_senha } = req.body;

    const utilizador = await User.findOne({
      where: {
        id,
        client_id: req.session.user.client_id
      }
    });

    if (!utilizador) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    const hashedPassword = await bcrypt.hash(nova_senha, 10);
    await utilizador.update({ 
      password: hashedPassword,
      forcar_mudanca_senha: 1
    });

    res.json({ 
      success: true, 
      message: 'Senha resetada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({ error: 'Erro ao resetar senha' });
  }
};

// Exportar utilizadores
exports.export = async (req, res) => {
  try {
    const { formato } = req.query;
    
    const utilizadores = await User.findAll({
      where: { client_id: req.session.user.client_id },
      order: [['nome', 'ASC']],
      attributes: { exclude: ['password'] }
    });

    if (formato === 'excel') {
      // Implementar exportação para Excel
      res.json({ message: 'Exportação Excel em desenvolvimento', utilizadores });
    } else if (formato === 'csv') {
      // Implementar exportação para CSV
      res.json({ message: 'Exportação CSV em desenvolvimento', utilizadores });
    } else if (formato === 'pdf') {
      // Implementar exportação para PDF
      res.json({ message: 'Exportação PDF em desenvolvimento', utilizadores });
    } else {
      res.json({ utilizadores });
    }
  } catch (error) {
    console.error('Erro ao exportar utilizadores:', error);
    res.status(500).json({ error: 'Erro ao exportar utilizadores' });
  }
};

// Importar utilizadores
exports.import = async (req, res) => {
  try {
    // Implementar importação de utilizadores
    res.json({ message: 'Importação em desenvolvimento' });
  } catch (error) {
    console.error('Erro ao importar utilizadores:', error);
    res.status(500).json({ error: 'Erro ao importar utilizadores' });
  }
};