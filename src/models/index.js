
// ====================================
// src/models/index.js
// ====================================
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Importar todos os modelos
const User = require('./User');
const Cliente = require('./Cliente')(sequelize, DataTypes);
const Fornecedor = require('./Fornecedor')(sequelize, DataTypes);
const Categoria = require('./Categoria')(sequelize, DataTypes);
const Iva = require('./Iva')(sequelize, DataTypes);
const Artigo = require('./Artigo')(sequelize, DataTypes);
const Loja = require('./Loja')(sequelize, DataTypes);
const Compra = require('./Compra')(sequelize, DataTypes);
const Estoque = require('./Estoque')(sequelize, DataTypes);
const ContaPagar = require('./ContaPagar')(sequelize, DataTypes);
const ContaReceber = require('./ContaReceber')(sequelize, DataTypes);
const Venda = require('./Venda')(sequelize, DataTypes);
const Configuracao = require('./Configuracao')(sequelize, DataTypes);

// Definir associações
const models = {
  User,
  Cliente,
  Fornecedor,
  Categoria,
  Iva,
  Artigo,
  Loja,
  Compra,
  Estoque,
  ContaPagar,
  ContaReceber,
  Venda,
  Configuracao
};

// Associações principais
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};