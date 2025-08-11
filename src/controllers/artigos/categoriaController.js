// ====================================
// src/controllers/artigos/categoriaController.js
// ====================================
const { Categoria } = require('../../models');
const { Op } = require('sequelize');

class CategoriaController {
  // Listar categorias (dados fictícios)
  async index(req, res) {
    try {
      const { page = 1, limit = 10, search = '', parent = '', status = '' } = req.query;
      
      // Dados fictícios de categorias
      const categoriasFicticias = [
        {
          id: 1,
          codigo: 'CAT001',
          nome: 'Eletrônicos',
          descricao: 'Produtos eletrônicos e tecnológicos',
          cor: '#007bff',
          icone: 'fas fa-laptop',
          ordem: 1,
          status: 1,
          parent_id: null,
          parent: null,
          subcategorias: [
            { id: 6, nome: 'Smartphones', cor: '#17a2b8', status: 1 },
            { id: 7, nome: 'Notebooks', cor: '#6f42c1', status: 1 }
          ],
          createdAt: new Date('2024-01-01')
        },
        {
          id: 2,
          codigo: 'CAT002',
          nome: 'Móveis',
          descricao: 'Móveis para casa e escritório',
          cor: '#28a745',
          icone: 'fas fa-chair',
          ordem: 2,
          status: 1,
          parent_id: null,
          parent: null,
          subcategorias: [
            { id: 8, nome: 'Mesas', cor: '#20c997', status: 1 },
            { id: 9, nome: 'Cadeiras', cor: '#fd7e14', status: 1 }
          ],
          createdAt: new Date('2024-01-02')
        },
        {
          id: 3,
          codigo: 'CAT003',
          nome: 'Roupas',
          descricao: 'Vestuário e acessórios',
          cor: '#dc3545',
          icone: 'fas fa-tshirt',
          ordem: 3,
          status: 1,
          parent_id: null,
          parent: null,
          subcategorias: [
            { id: 10, nome: 'Camisetas', cor: '#e83e8c', status: 1 },
            { id: 11, nome: 'Calças', cor: '#6610f2', status: 1 }
          ],
          createdAt: new Date('2024-01-03')
        },
        {
          id: 4,
          codigo: 'CAT004',
          nome: 'Livros',
          descricao: 'Livros e material educativo',
          cor: '#ffc107',
          icone: 'fas fa-book',
          ordem: 4,
          status: 1,
          parent_id: null,
          parent: null,
          subcategorias: [
            { id: 12, nome: 'Ficção', cor: '#fd7e14', status: 1 },
            { id: 13, nome: 'Técnicos', cor: '#6c757d', status: 1 }
          ],
          createdAt: new Date('2024-01-04')
        },
        {
          id: 5,
          codigo: 'CAT005',
          nome: 'Casa e Jardim',
          descricao: 'Produtos para casa e jardim',
          cor: '#17a2b8',
          icone: 'fas fa-home',
          ordem: 5,
          status: 0,
          parent_id: null,
          parent: null,
          subcategorias: [],
          createdAt: new Date('2024-01-05')
        },
        {
          id: 6,
          codigo: 'SUB001',
          nome: 'Smartphones',
          descricao: 'Telefones inteligentes',
          cor: '#17a2b8',
          icone: 'fas fa-mobile-alt',
          ordem: 1,
          status: 1,
          parent_id: 1,
          parent: { id: 1, nome: 'Eletrônicos', cor: '#007bff' },
          subcategorias: [],
          createdAt: new Date('2024-01-06')
        },
        {
          id: 7,
          codigo: 'SUB002',
          nome: 'Notebooks',
          descricao: 'Computadores portáteis',
          cor: '#6f42c1',
          icone: 'fas fa-laptop',
          ordem: 2,
          status: 1,
          parent_id: 1,
          parent: { id: 1, nome: 'Eletrônicos', cor: '#007bff' },
          subcategorias: [],
          createdAt: new Date('2024-01-07')
        }
      ];

      // Categorias pai fictícias para filtro
      const categoriasPaiFicticias = [
        { id: 1, nome: 'Eletrônicos' },
        { id: 2, nome: 'Móveis' },
        { id: 3, nome: 'Roupas' },
        { id: 4, nome: 'Livros' }
      ];

      // Filtrar categorias baseado na busca
      let categoriasFiltradas = categoriasFicticias;
      if (search) {
        categoriasFiltradas = categoriasFicticias.filter(categoria => 
          categoria.nome.toLowerCase().includes(search.toLowerCase()) ||
          categoria.codigo.toLowerCase().includes(search.toLowerCase()) ||
          (categoria.descricao && categoria.descricao.toLowerCase().includes(search.toLowerCase()))
        );
      }

      if (parent !== '') {
        if (parent === 'null') {
          categoriasFiltradas = categoriasFiltradas.filter(categoria => categoria.parent_id === null);
        } else {
          categoriasFiltradas = categoriasFiltradas.filter(categoria => categoria.parent_id == parent);
        }
      }

      if (status !== '') {
        categoriasFiltradas = categoriasFiltradas.filter(categoria => categoria.status == status);
      }

      // Paginação
      const totalItems = categoriasFiltradas.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const categorias = categoriasFiltradas.slice(startIndex, startIndex + parseInt(limit));

      res.render('artigos/categorias/index', {
        title: 'Categorias - SYNTRA ERP',
        layout: 'layouts/main',
        categorias,
        categoriasPai: categoriasPaiFicticias,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          limit: parseInt(limit)
        },
        filters: {
          search,
          parent,
          status
        }
      });
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      req.flash('error', 'Erro ao carregar categorias');
      res.redirect('/dashboard');
    }
  }

  // Exibir formulário de criação
  async create(req, res) {
    try {
      // Buscar categorias pai
      const categoriasPai = await Categoria.findAll({
        where: { 
          client_id: req.session.user.client_id, 
          parent_id: null,
          status: 1 
        },
        order: [['nome', 'ASC']]
      });

      // Gerar próximo código
      const ultimaCategoria = await Categoria.findOne({
        where: { client_id: req.session.user.client_id },
        order: [['id', 'DESC']]
      });

      const proximoNumero = ultimaCategoria ? ultimaCategoria.id + 1 : 1;
      const proximoCodigo = `CAT${proximoNumero.toString().padStart(4, '0')}`;

      res.render('artigos/categorias/create', {
        title: 'Nova Categoria - SYNTRA ERP',
        layout: 'layouts/main',
        categoriasPai,
        proximoCodigo
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de criação:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/categorias');
    }
  }

  // Criar categoria
  async store(req, res) {
    try {
      const {
        nome,
        codigo,
        descricao,
        parent_id,
        meta_title,
        meta_description,
        status
      } = req.body;

      // Validações obrigatórias
      if (!nome) {
        req.flash('error', 'Nome é obrigatório');
        return res.redirect('/categorias/create');
      }

      // Gerar código se não fornecido
      let codigoFinal = codigo;
      if (!codigoFinal) {
        const ultimaCategoria = await Categoria.findOne({
          where: { client_id: req.session.user.client_id },
          order: [['id', 'DESC']]
        });

        const proximoNumero = ultimaCategoria ? ultimaCategoria.id + 1 : 1;
        codigoFinal = `CAT${proximoNumero.toString().padStart(4, '0')}`;
      }

      // Gerar slug
      const slug = this.gerarSlug(nome);

      // Criar categoria
      const novaCategoria = await Categoria.create({
        client_id: req.session.user.client_id,
        nome,
        codigo: codigoFinal,
        descricao,
        parent_id: parent_id || null,
        slug,
        meta_title: meta_title || nome,
        meta_description,
        cor: this.gerarCorAleatoria(),
        status: status === 'on' ? 1 : 0,
        user_id: req.session.user.id
      });

      req.flash('success', 'Categoria criada com sucesso');
      res.redirect(`/categorias/${novaCategoria.id}`);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      req.flash('error', 'Erro ao criar categoria');
      res.redirect('/categorias/create');
    }
  }

  // Exibir categoria
  async show(req, res) {
    try {
      const { id } = req.params;

      const categoria = await Categoria.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        },
        include: [
          {
            model: Categoria,
            as: 'parent',
            attributes: ['id', 'nome', 'cor']
          },
          {
            model: Categoria,
            as: 'subcategorias',
            attributes: ['id', 'nome', 'cor', 'status']
          }
        ]
      });

      if (!categoria) {
        req.flash('error', 'Categoria não encontrada');
        return res.redirect('/categorias');
      }

      res.render('artigos/categorias/show', {
        title: `${categoria.nome} - SYNTRA ERP`,
        layout: 'layouts/main',
        categoria
      });
    } catch (error) {
      console.error('Erro ao exibir categoria:', error);
      req.flash('error', 'Erro ao carregar categoria');
      res.redirect('/categorias');
    }
  }

  // Exibir formulário de edição
  async edit(req, res) {
    try {
      const { id } = req.params;

      const categoria = await Categoria.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!categoria) {
        req.flash('error', 'Categoria não encontrada');
        return res.redirect('/categorias');
      }

      // Buscar categorias pai (exceto a própria categoria)
      const categoriasPai = await Categoria.findAll({
        where: { 
          client_id: req.session.user.client_id, 
          parent_id: null,
          id: { [Op.ne]: id },
          status: 1 
        },
        order: [['nome', 'ASC']]
      });

      res.render('artigos/categorias/edit', {
        title: `Editar ${categoria.nome} - SYNTRA ERP`,
        layout: 'layouts/main',
        categoria,
        categoriasPai
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de edição:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/categorias');
    }
  }

  // Atualizar categoria
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        nome,
        codigo,
        descricao,
        parent_id,
        meta_title,
        meta_description,
        status
      } = req.body;

      const categoria = await Categoria.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!categoria) {
        req.flash('error', 'Categoria não encontrada');
        return res.redirect('/categorias');
      }

      // Validações obrigatórias
      if (!nome) {
        req.flash('error', 'Nome é obrigatório');
        return res.redirect(`/categorias/${id}/edit`);
      }

      // Gerar slug
      const slug = this.gerarSlug(nome);

      // Atualizar categoria
      await categoria.update({
        nome,
        codigo,
        descricao,
        parent_id: parent_id || null,
        slug,
        meta_title: meta_title || nome,
        meta_description,
        status: status === 'on' ? 1 : 0
      });

      req.flash('success', 'Categoria atualizada com sucesso');
      res.redirect(`/categorias/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      req.flash('error', 'Erro ao atualizar categoria');
      res.redirect(`/categorias/${req.params.id}/edit`);
    }
  }

  // Excluir categoria
  async destroy(req, res) {
    try {
      const { id } = req.params;

      const categoria = await Categoria.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      // Verificar se categoria tem subcategorias
      const subcategorias = await Categoria.count({
        where: {
          parent_id: id,
          client_id: req.session.user.client_id
        }
      });

      if (subcategorias > 0) {
        return res.status(400).json({ error: 'Categoria possui subcategorias' });
      }

      await categoria.destroy();

      res.json({ success: true, message: 'Categoria excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      res.status(500).json({ error: 'Erro ao excluir categoria' });
    }
  }

  // Gerar slug
  gerarSlug(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Gerar cor aleatória
  gerarCorAleatoria() {
    const cores = [
      '#007bff', '#6c757d', '#28a745', '#dc3545', '#ffc107',
      '#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'
    ];
    return cores[Math.floor(Math.random() * cores.length)];
  }
}

module.exports = new CategoriaController();