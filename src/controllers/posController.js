// ====================================
// src/controllers/posController.js
// ====================================

class PosController {
  // Página principal do POS
  async index(req, res) {
    try {
      // Dados mockados para a interface
      const configPOS = {
        pos_ativo: true,
        impressora_termica: true,
        leitor_codigo_barras: true,
        gaveta_dinheiro: true,
        verificar_stock: true,
        bloquear_venda_sem_stock: false,
        alerta_stock_baixo: true,
        limite_stock_baixo: 5,
        tema: 'claro',
        tamanho_fonte: 'medio',
        exibir_favoritos: true,
        atalhos_teclado: true,
        produtos_favoritos: []
      };
      
      const produtosFavoritos = [];
      
      const clientes = [
        { id: 1, nome: 'Cliente Geral', codigo: 'CLI001' },
        { id: 2, nome: 'João Silva', codigo: 'CLI002' },
        { id: 3, nome: 'Maria Santos', codigo: 'CLI003' }
      ];
      
      res.render('pos/index', {
        title: 'Terminal POS - SYNTRA ERP',
        layout: 'layouts/main',
        configPOS,
        produtosFavoritos,
        clientes,
        loja_id: 1
      });
      
    } catch (error) {
      console.error('Erro ao carregar POS:', error);
      req.flash('error', 'Erro ao carregar terminal POS');
      res.redirect('/dashboard');
    }
  }

  async configuracoes(req, res) {
  // Dados mock para configurações do POS
  const configPOS = {
    pos_ativo: true,
    nome_loja: 'SYNTRA Store',
    endereco_loja: 'Rua Principal, 123',
    telefone_loja: '+258 84 123 4567',
    impressora_termica: true,
    tipo_impressora: 'ESC/POS',
    porta_impressora: 'USB001',
    alerta_stock_baixo: true,
    limite_stock_minimo: 5,
    permitir_venda_sem_stock: false,
    tema_interface: 'claro',
    tamanho_fonte: 'medio',
    mostrar_imagens_produtos: true,
    backup_automatico: true,
    intervalo_backup: 24,
    senha_supervisor: '',
    timeout_sessao: 30
  };
  
  res.render('pos/configuracoes', { 
    title: 'Configurações POS',
    configPOS: configPOS
  });
}
  
  // Buscar produtos para o POS (mockado)
  async buscarProdutos(req, res) {
    try {
      const produtos = [
        {
          id: 1,
          codigo: 'PROD001',
          nome: 'Produto Exemplo 1',
          preco: 25.50,
          stock: 10,
          codigo_barras: '1234567890',
          categoria: 1,
          iva_taxa: 16
        },
        {
          id: 2,
          codigo: 'PROD002',
          nome: 'Produto Exemplo 2',
          preco: 15.00,
          stock: 5,
          codigo_barras: '0987654321',
          categoria: 1,
          iva_taxa: 16
        }
      ];
      
      res.json({
        success: true,
        produtos,
        total: produtos.length
      });
      
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos'
      });
    }
  }
  
  // Buscar produto por código de barras (mockado)
  async buscarPorCodigo(req, res) {
    try {
      const { codigo } = req.params;
      
      // Produto mockado
      const produto = {
        id: 1,
        codigo: 'PROD001',
        nome: 'Produto Encontrado',
        preco: 25.50,
        stock: 10,
        codigo_barras: codigo,
        categoria: 1,
        iva_taxa: 16
      };
      
      res.json({
        success: true,
        produto
      });
      
    } catch (error) {
      console.error('Erro ao buscar produto por código:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produto'
      });
    }
  }
  
  // Verificar disponibilidade de stock (mockado)
  async verificarStock(req, res) {
    try {
      res.json({
        success: true,
        disponivel: true,
        quantidade_disponivel: 10,
        bloquear_venda: false,
        alerta_stock_baixo: false
      });
      
    } catch (error) {
      console.error('Erro ao verificar stock:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao verificar disponibilidade'
      });
    }
  }
  
  // Processar venda (mockado)
  async processarVenda(req, res) {
    try {
      const { total } = req.body;
      
      // Simular processamento de venda
      const vendaId = Math.floor(Math.random() * 1000) + 1;
      
      res.json({
        success: true,
        message: 'Venda processada com sucesso',
        venda_id: vendaId,
        numero_venda: `VND${vendaId.toString().padStart(6, '0')}`,
        total
      });
      
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar venda'
      });
    }
  }
      

  
  // Todos os métodos restantes simplificados para interface
  async imprimirRecibo(req, res) {
    res.json({ success: true, message: 'Recibo impresso' });
  }
  

  
  
  async salvarConfiguracoes(req, res) {
    res.json({ success: true, message: 'Configurações salvas' });
  }
  
  async adicionarFavorito(req, res) {
    res.json({ success: true, message: 'Produto adicionado aos favoritos' });
  }
  
  async removerFavorito(req, res) {
    res.json({ success: true, message: 'Produto removido dos favoritos' });
  }
  
  async testarImpressora(req, res) {
    res.json({ success: true, message: 'Teste de impressora realizado' });
  }
  
  async resetarConfiguracoes(req, res) {
    res.json({ success: true, message: 'Configurações resetadas' });
  }
  
  async abrirGaveta(req, res) {
    res.json({ success: true, message: 'Gaveta aberta' });
  }
}

module.exports = new PosController();