// ====================================
// src/models/Loja.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const Loja = sequelize.define('Loja', {
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
      type: DataTypes.STRING(100),
      allowNull: false
    },
    endereco: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nuit: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    alvara: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    is_principal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    pos_ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    numeracao_independente: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ultimo_numero_factura: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 0
    },
    ultimo_numero_recibo: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 0
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1
    }
  }, {
    tableName: 'lojas',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['codigo'] }
    ]
  });

  return Loja;
};
