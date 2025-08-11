const { Cliente } = require('../../models');
const { Op } = require('sequelize');

class ClienteController {
  async index(req, res) {
    try {
      const client_id = req.session.user.client_id;
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';
      
      const whereClause = { client_id };

      if (search) {
        whereClause[Op.or] = [
          { nome: { [Op.like]: `%${search}%` } },
          { codigo: { [Op.like]: `%${search}%` } },
          { telefone: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: clientes } = await Cliente.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['nome', 'ASC']]
      });

      const totalPages = Math.ceil(count / limit);

      res.render('pessoas/clientes/index', {
        title: 'Clientes - SYNTRA ERP',
        layout: 'layouts/main',
        clientes,
        currentPage: page,
        totalPages,
        search,
        totalRecords: count
      });

    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      req.flash('error', 'Erro ao carregar clientes');
      res.redirect('/dashboard');
    }
  }

  async create(req, res) {
    try {
      res.render('pessoas/clientes/create', {
        title: 'Novo Cliente - SYNTRA ERP',
        layout: 'layouts/main'
      });
    } catch (error) {
      console.error('Erro ao exibir formulário:', error);
      res.redirect('/pessoas/clientes');
    }
  }

  async store(req, res) {
    try {
      const client_id = req.session.user.client_id;
      const { nome, nuit, tipo, telefone, email, endereco, limite_credito } = req.body;

      // Gerar código automático
      const ultimoCliente = await Cliente.findOne({
        where: { client_id },
        order: [['id', 'DESC']]
      });

      const proximoNumero = ultimoCliente ? ultimoCliente.id + 1 : 1;
      const codigo = `CLI${proximoNumero.toString().padStart(6, '0')}`;

      await Cliente.create({
        client_id,
        codigo,
        nome,
        nuit: nuit || null,
        tipo: parseInt(tipo),
        telefone,
        email: email || null,
        endereco: endereco || null,
        limite_credito: parseFloat(limite_credito) || 0
      });

      req.flash('success', 'Cliente criado com sucesso!');
      res.redirect('/pessoas/clientes');

    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      req.flash('error', 'Erro ao criar cliente');
      res.redirect('/pessoas/clientes/create');
    }
  }

  // Exibir cliente
  async show(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!cliente) {
        req.flash('error', 'Cliente não encontrado');
        return res.redirect('/pessoas/clientes');
      }

      res.render('pessoas/clientes/show', {
        title: `Cliente - ${cliente.nome}`,
        layout: 'layouts/main',
        cliente
      });
    } catch (error) {
      console.error('Erro ao exibir cliente:', error);
      req.flash('error', 'Erro ao carregar cliente');
      res.redirect('/pessoas/clientes');
    }
  }

  // Exibir formulário de edição
  async edit(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!cliente) {
        req.flash('error', 'Cliente não encontrado');
        return res.redirect('/pessoas/clientes');
      }

      res.render('pessoas/clientes/edit', {
        title: `Editar - ${cliente.nome}`,
        layout: 'layouts/main',
        cliente
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de edição:', error);
      res.redirect('/pessoas/clientes');
    }
  }

  // Atualizar cliente
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, nuit, tipo, telefone, email, endereco, limite_credito } = req.body;

      const cliente = await Cliente.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!cliente) {
        req.flash('error', 'Cliente não encontrado');
        return res.redirect('/pessoas/clientes');
      }

      await cliente.update({
        nome,
        nuit: nuit || null,
        tipo: parseInt(tipo),
        telefone,
        email: email || null,
        endereco: endereco || null,
        limite_credito: parseFloat(limite_credito) || 0
      });

      req.flash('success', 'Cliente atualizado com sucesso!');
      res.redirect(`/pessoas/clientes/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      req.flash('error', 'Erro ao atualizar cliente');
      res.redirect(`/pessoas/clientes/${req.params.id}/edit`);
    }
  }

  // Excluir cliente
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!cliente) {
        req.flash('error', 'Cliente não encontrado');
        return res.redirect('/pessoas/clientes');
      }

      await cliente.destroy();
      req.flash('success', 'Cliente excluído com sucesso!');
      res.redirect('/pessoas/clientes');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      req.flash('error', 'Erro ao excluir cliente');
      res.redirect('/pessoas/clientes');
    }
  }

  // Exportar clientes
  async export(req, res) {
    try {
      const { formato } = req.query;
      
      const clientes = await Cliente.findAll({
        where: { client_id: req.session.user.client_id },
        order: [['nome', 'ASC']]
      });

      if (formato === 'excel') {
        // Implementar exportação para Excel
        res.json({ message: 'Exportação Excel em desenvolvimento', clientes });
      } else if (formato === 'csv') {
        // Implementar exportação para CSV
        res.json({ message: 'Exportação CSV em desenvolvimento', clientes });
      } else if (formato === 'pdf') {
        // Implementar exportação para PDF
        res.json({ message: 'Exportação PDF em desenvolvimento', clientes });
      } else {
        res.json({ clientes });
      }
    } catch (error) {
      console.error('Erro ao exportar clientes:', error);
      res.status(500).json({ error: 'Erro ao exportar clientes' });
    }
  }

  // Importar clientes
  async import(req, res) {
    try {
      // Implementar importação de clientes
      res.json({ message: 'Importação em desenvolvimento' });
    } catch (error) {
      console.error('Erro ao importar clientes:', error);
      res.status(500).json({ error: 'Erro ao importar clientes' });
    }
  }
}

module.exports = new ClienteController();