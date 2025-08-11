// ====================================
// src/models/Venda.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const Venda = sequelize.define('Venda', {
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
    cliente_id: {
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
    data_venda: {
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
      comment: '1=Factura, 2=Factura-Recibo, 3=Cotação'
    },
    forma_pagamento: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1,
      comment: '1=Dinheiro, 2=Transferência, 3=Cheque, 4=A prazo'
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1,
      comment: '1=Pendente, 2=Pago, 3=Cancelado, 4=Vencido'
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'vendas',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['cliente_id'] },
      { fields: ['numero'] },
      { fields: ['data_venda'] }
    ]
  });

  Venda.associate = function(models) {
    Venda.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
    Venda.belongsTo(models.User, { foreignKey: 'user_id', as: 'usuario' });
    Venda.belongsTo(models.Loja, { foreignKey: 'loja_id', as: 'loja' });
  };

  return Venda;
};