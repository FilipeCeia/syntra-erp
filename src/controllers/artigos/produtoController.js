// ====================================
// src/controllers/artigos/produtoController.js
// ====================================
const { Artigo, Categoria, Iva } = require('../../models');
const { Op } = require('sequelize');

class ProdutoController {
  // Listar produtos (dados fictícios)
  async index(req, res) {
    try {
      const { page = 1, limit = 10, search = '', categoria = '', status = '' } = req.query;
      
      // Dados fictícios de produtos
      const produtosFicticios = [
        {
          id: 1,
          codigo_interno: 'PROD001',
          codigo_barras: '1234567890123',
          nome: 'Smartphone Samsung Galaxy A54',
          descricao: 'Smartphone com 128GB de armazenamento e câmera de 50MP',
          preco_compra: 450.00,
          preco_venda: 650.00,
          stock_atual: 25,
          stock_minimo: 5,
          unidade: 'UN',
          status: 1,
          categoria: { id: 1, nome: 'Eletrônicos', cor: '#007bff' },
          iva: { id: 1, nome: 'IVA 17%', taxa: 17 },
          createdAt: new Date('2024-01-15')
        },
        {
          id: 2,
          codigo_interno: 'PROD002',
          codigo_barras: '2345678901234',
          nome: 'Notebook Lenovo IdeaPad 3',
          descricao: 'Notebook com processador Intel i5 e 8GB RAM',
          preco_compra: 850.00,
          preco_venda: 1200.00,
          stock_atual: 12,
          stock_minimo: 3,
          unidade: 'UN',
          status: 1,
          categoria: { id: 1, nome: 'Eletrônicos', cor: '#007bff' },
          iva: { id: 1, nome: 'IVA 17%', taxa: 17 },
          createdAt: new Date('2024-01-10')
        },
        {
          id: 3,
          codigo_interno: 'PROD003',
          codigo_barras: '3456789012345',
          nome: 'Mesa de Escritório',
          descricao: 'Mesa de escritório em madeira com gavetas',
          preco_compra: 180.00,
          preco_venda: 280.00,
          stock_atual: 8,
          stock_minimo: 2,
          unidade: 'UN',
          status: 1,
          categoria: { id: 2, nome: 'Móveis', cor: '#28a745' },
          iva: { id: 1, nome: 'IVA 17%', taxa: 17 },
          createdAt: new Date('2024-01-08')
        },
        {
          id: 4,
          codigo_interno: 'PROD004',
          codigo_barras: '4567890123456',
          nome: 'Cadeira Ergonômica',
          descricao: 'Cadeira de escritório com apoio lombar',
          preco_compra: 120.00,
          preco_venda: 200.00,
          stock_atual: 15,
          stock_minimo: 3,
          unidade: 'UN',
          status: 1,
          categoria: { id: 2, nome: 'Móveis', cor: '#28a745' },
          iva: { id: 1, nome: 'IVA 17%', taxa: 17 },
          createdAt: new Date('2024-01-05')
        },
        {
          id: 5,
          codigo_interno: 'PROD005',
          codigo_barras: '5678901234567',
          nome: 'Impressora HP LaserJet',
          descricao: 'Impressora laser monocromática',
          preco_compra: 220.00,
          preco_venda: 320.00,
          stock_atual: 6,
          stock_minimo: 2,
          unidade: 'UN',
          status: 1,
          categoria: { id: 1, nome: 'Eletrônicos', cor: '#007bff' },
          iva: { id: 1, nome: 'IVA 17%', taxa: 17 },
          createdAt: new Date('2024-01-03')
        }
      ];

      // Categorias fictícias para filtro
      const categoriasFicticias = [
        { id: 1, nome: 'Eletrônicos' },
        { id: 2, nome: 'Móveis' },
        { id: 3, nome: 'Roupas' },
        { id: 4, nome: 'Livros' }
      ];

      // Filtrar produtos baseado na busca
      let produtosFiltrados = produtosFicticios;
      if (search) {
        produtosFiltrados = produtosFicticios.filter(produto => 
          produto.nome.toLowerCase().includes(search.toLowerCase()) ||
          produto.codigo_interno.toLowerCase().includes(search.toLowerCase()) ||
          produto.codigo_barras.includes(search)
        );
      }

      if (categoria) {
        produtosFiltrados = produtosFiltrados.filter(produto => produto.categoria.id == categoria);
      }

      if (status !== '') {
        produtosFiltrados = produtosFiltrados.filter(produto => produto.status == status);
      }

      // Paginação
      const totalItems = produtosFiltrados.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const produtos = produtosFiltrados.slice(startIndex, startIndex + parseInt(limit));

      res.render('artigos/produtos/index', {
        title: 'Produtos - SYNTRA ERP',
        layout: 'layouts/main',
        produtos,
        categorias: categoriasFicticias,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          limit: parseInt(limit)
        },
        filters: {
          search,
          categoria,
          status
        }
      });
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      req.flash('error', 'Erro ao carregar produtos');
      res.redirect('/dashboard');
    }
  }

  // Exibir formulário de criação
  async create(req, res) {
    try {
      // Buscar categorias
      const categorias = await Categoria.findAll({
        where: { client_id: req.session.user.client_id, status: 1 },
        order: [['nome', 'ASC']]
      });

      // Buscar taxas de IVA
      const taxasIva = await Iva.findAll({
        where: { client_id: req.session.user.client_id, status: 1 },
        order: [['taxa', 'ASC']]
      });

      // Gerar próximo código interno
      const ultimoProduto = await Artigo.findOne({
        where: { client_id: req.session.user.client_id },
        order: [['id', 'DESC']]
      });

      const proximoNumero = ultimoProduto ? ultimoProduto.id + 1 : 1;
      const proximoCodigo = `PRD${proximoNumero.toString().padStart(6, '0')}`;

      res.render('artigos/produtos/create', {
        title: 'Novo Produto - SYNTRA ERP',
        layout: 'layouts/main',
        categorias,
        taxasIva,
        proximoCodigo
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de criação:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/produtos');
    }
  }

  // Criar produto
  async store(req, res) {
    try {
      const {
        nome,
        categoria_id,
        unidade_medida,
        preco_venda,
        codigo_interno,
        codigo_barras,
        descricao,
        preco_custo,
        stock_minimo,
        stock_maximo,
        iva_id,
        desconto,
        iva_incluso,
        isento_iva,
        justificacao_isencao,
        controla_stock,
        status
      } = req.body;

      // Validações obrigatórias
      if (!nome || !categoria_id || !unidade_medida || !preco_venda) {
        req.flash('error', 'Campos obrigatórios não preenchidos');
        return res.redirect('/produtos/create');
      }

      // Verificar se código interno já existe
      if (codigo_interno) {
        const produtoExistente = await Artigo.findOne({
          where: {
            client_id: req.session.user.client_id,
            codigo_interno
          }
        });

        if (produtoExistente) {
          req.flash('error', 'Código interno já existe');
          return res.redirect('/produtos/create');
        }
      }

      // Verificar se código de barras já existe
      if (codigo_barras) {
        const produtoExistente = await Artigo.findOne({
          where: {
            client_id: req.session.user.client_id,
            codigo_barras
          }
        });

        if (produtoExistente) {
          req.flash('error', 'Código de barras já existe');
          return res.redirect('/produtos/create');
        }
      }

      // Gerar código interno se não fornecido
      let codigoFinal = codigo_interno;
      if (!codigoFinal) {
        const ultimoProduto = await Artigo.findOne({
          where: { client_id: req.session.user.client_id },
          order: [['id', 'DESC']]
        });

        const proximoNumero = ultimoProduto ? ultimoProduto.id + 1 : 1;
        codigoFinal = `PRD${proximoNumero.toString().padStart(6, '0')}`;
      }

      // Criar produto
      const novoProduto = await Artigo.create({
        client_id: req.session.user.client_id,
        nome,
        categoria_id,
        unidade_medida,
        preco_venda: parseFloat(preco_venda),
        codigo_interno: codigoFinal,
        codigo_barras,
        descricao,
        preco_custo: preco_custo ? parseFloat(preco_custo) : null,
        stock_minimo: stock_minimo ? parseInt(stock_minimo) : 0,
        stock_maximo: stock_maximo ? parseInt(stock_maximo) : 0,
        stock_atual: 0,
        iva_id: isento_iva ? null : iva_id,
        desconto: desconto ? parseFloat(desconto) : 0,
        iva_incluso: iva_incluso === 'on' ? 1 : 0,
        isento_iva: isento_iva === 'on' ? 1 : 0,
        justificacao_isencao: isento_iva === 'on' ? justificacao_isencao : null,
        controla_stock: controla_stock === 'on' ? 1 : 0,
        status: status === 'on' ? 1 : 0,
        user_id: req.session.user.id
      });

      req.flash('success', 'Produto criado com sucesso');
      res.redirect(`/produtos/${novoProduto.id}`);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      req.flash('error', 'Erro ao criar produto');
      res.redirect('/produtos/create');
    }
  }

  // Exibir produto
  async show(req, res) {
    try {
      const { id } = req.params;

      const produto = await Artigo.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        },
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome', 'cor']
          },
          {
            model: Iva,
            as: 'iva',
            attributes: ['id', 'nome', 'taxa']
          }
        ]
      });

      if (!produto) {
        req.flash('error', 'Produto não encontrado');
        return res.redirect('/produtos');
      }

      res.render('artigos/produtos/show', {
        title: `${produto.nome} - SYNTRA ERP`,
        layout: 'layouts/main',
        produto
      });
    } catch (error) {
      console.error('Erro ao exibir produto:', error);
      req.flash('error', 'Erro ao carregar produto');
      res.redirect('/produtos');
    }
  }

  // Exibir formulário de edição
  async edit(req, res) {
    try {
      const { id } = req.params;

      const produto = await Artigo.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!produto) {
        req.flash('error', 'Produto não encontrado');
        return res.redirect('/produtos');
      }

      // Buscar categorias
      const categorias = await Categoria.findAll({
        where: { client_id: req.session.user.client_id, status: 1 },
        order: [['nome', 'ASC']]
      });

      // Buscar taxas de IVA
      const taxasIva = await Iva.findAll({
        where: { client_id: req.session.user.client_id, status: 1 },
        order: [['taxa', 'ASC']]
      });

      res.render('artigos/produtos/edit', {
        title: `Editar ${produto.nome} - SYNTRA ERP`,
        layout: 'layouts/main',
        produto,
        categorias,
        taxasIva
      });
    } catch (error) {
      console.error('Erro ao exibir formulário de edição:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/produtos');
    }
  }

  // Atualizar produto
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        nome,
        categoria_id,
        unidade_medida,
        preco_venda,
        codigo_interno,
        codigo_barras,
        descricao,
        preco_custo,
        stock_minimo,
        stock_maximo,
        iva_id,
        desconto,
        iva_incluso,
        isento_iva,
        justificacao_isencao,
        controla_stock,
        status
      } = req.body;

      const produto = await Artigo.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!produto) {
        req.flash('error', 'Produto não encontrado');
        return res.redirect('/produtos');
      }

      // Validações obrigatórias
      if (!nome || !categoria_id || !unidade_medida || !preco_venda) {
        req.flash('error', 'Campos obrigatórios não preenchidos');
        return res.redirect(`/produtos/${id}/edit`);
      }

      // Verificar se código interno já existe (exceto o atual)
      if (codigo_interno && codigo_interno !== produto.codigo_interno) {
        const produtoExistente = await Artigo.findOne({
          where: {
            client_id: req.session.user.client_id,
            codigo_interno,
            id: { [Op.ne]: id }
          }
        });

        if (produtoExistente) {
          req.flash('error', 'Código interno já existe');
          return res.redirect(`/produtos/${id}/edit`);
        }
      }

      // Verificar se código de barras já existe (exceto o atual)
      if (codigo_barras && codigo_barras !== produto.codigo_barras) {
        const produtoExistente = await Artigo.findOne({
          where: {
            client_id: req.session.user.client_id,
            codigo_barras,
            id: { [Op.ne]: id }
          }
        });

        if (produtoExistente) {
          req.flash('error', 'Código de barras já existe');
          return res.redirect(`/produtos/${id}/edit`);
        }
      }

      // Atualizar produto
      await produto.update({
        nome,
        categoria_id,
        unidade_medida,
        preco_venda: parseFloat(preco_venda),
        codigo_interno,
        codigo_barras,
        descricao,
        preco_custo: preco_custo ? parseFloat(preco_custo) : null,
        stock_minimo: stock_minimo ? parseInt(stock_minimo) : 0,
        stock_maximo: stock_maximo ? parseInt(stock_maximo) : 0,
        iva_id: isento_iva ? null : iva_id,
        desconto: desconto ? parseFloat(desconto) : 0,
        iva_incluso: iva_incluso === 'on' ? 1 : 0,
        isento_iva: isento_iva === 'on' ? 1 : 0,
        justificacao_isencao: isento_iva === 'on' ? justificacao_isencao : null,
        controla_stock: controla_stock === 'on' ? 1 : 0,
        status: status === 'on' ? 1 : 0
      });

      req.flash('success', 'Produto atualizado com sucesso');
      res.redirect(`/produtos/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      req.flash('error', 'Erro ao atualizar produto');
      res.redirect(`/produtos/${req.params.id}/edit`);
    }
  }

  // Excluir produto
  async destroy(req, res) {
    try {
      const { id } = req.params;

      const produto = await Artigo.findOne({
        where: {
          id,
          client_id: req.session.user.client_id
        }
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Verificar se produto tem movimentações
      // TODO: Implementar verificação de movimentações

      await produto.destroy();

      res.json({ success: true, message: 'Produto excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  }

  // Gerar código de barras
  async gerarCodigoBarras(req, res) {
    try {
      // Gerar código EAN-13 simples
      const timestamp = Date.now().toString();
      const codigoBarras = timestamp.substring(timestamp.length - 12);
      const digitoVerificador = this.calcularDigitoVerificadorEAN13(codigoBarras);
      const codigoCompleto = codigoBarras + digitoVerificador;

      res.json({ codigo: codigoCompleto });
    } catch (error) {
      console.error('Erro ao gerar código de barras:', error);
      res.status(500).json({ error: 'Erro ao gerar código de barras' });
    }
  }

  // Calcular dígito verificador EAN-13
  calcularDigitoVerificadorEAN13(codigo) {
    let soma = 0;
    for (let i = 0; i < codigo.length; i++) {
      const digito = parseInt(codigo[i]);
      soma += (i % 2 === 0) ? digito : digito * 3;
    }
    const resto = soma % 10;
    return resto === 0 ? 0 : 10 - resto;
  }
}

module.exports = new ProdutoController();