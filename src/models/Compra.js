// ====================================
// src/models/Compra.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const Compra = sequelize.define('Compra', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    loja_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    fornecedor_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    numero: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    data_compra: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    data_vencimento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0.00
    },
    desconto: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0.00
    },
    iva_total: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0.00
    },
    total: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    tipo: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1,
      comment: '1=Mercadoria, 2=Despesa'
    },
    forma_pagamento: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1,
      comment: '1=À vista, 2=A prazo'
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1,
      comment: '1=Pendente, 2=Pago, 3=Cancelado'
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'compras',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['fornecedor_id'] },
      { fields: ['numero'] },
      { fields: ['data_compra'] }
    ]
  });

  Compra.associate = function(models) {
    Compra.belongsTo(models.Fornecedor, { foreignKey: 'fornecedor_id', as: 'fornecedor' });
    Compra.belongsTo(models.User, { foreignKey: 'user_id', as: 'usuario' });
    Compra.belongsTo(models.Loja, { foreignKey: 'loja_id', as: 'loja' });
  };

  return Compra;
};
