// ====================================
// src/models/Fornecedor.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const Fornecedor = sequelize.define('Fornecedor', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    nuit: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    endereco: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pessoa_contacto: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dias_pagamento: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 30
    },
    alvara: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    regime_tributario: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    saldo_conta: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1
    }
  }, {
    tableName: 'fornecedores',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['codigo'] },
      { fields: ['nuit'] },
      { fields: ['nome'] }
    ]
  });

  return Fornecedor;
};