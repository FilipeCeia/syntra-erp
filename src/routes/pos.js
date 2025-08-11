// ====================================
// src/routes/pos.js
// ====================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');
const posController = require('../controllers/posController');

router.use(authMiddleware);
router.use(permissionMiddleware([4, 5])); // Vendas e Caixa

// Página principal do POS
router.get('/', posController.index);

// API para buscar produtos
router.get('/api/produtos', posController.buscarProdutos);

// API para verificar stock
router.post('/api/verificar-stock', posController.verificarStock);

// API para processar venda
router.post('/api/processar-venda', posController.processarVenda);

// API para imprimir recibo
router.get('/api/recibo/:venda_id', posController.imprimirRecibo);

// Configurações do POS
router.get('/configuracoes', posController.configuracoes);
router.post('/configuracoes', posController.salvarConfiguracoes);

// Adicionar produto aos favoritos
router.post('/adicionar-favorito', posController.adicionarFavorito);

// Remover produto dos favoritos
router.post('/remover-favorito', posController.removerFavorito);

// Testar impressora
router.post('/testar-impressora', posController.testarImpressora);

// Resetar configurações
router.post('/resetar-configuracoes', posController.resetarConfiguracoes);

// Abrir gaveta de dinheiro
router.post('/abrir-gaveta', posController.abrirGaveta);

module.exports = router;
