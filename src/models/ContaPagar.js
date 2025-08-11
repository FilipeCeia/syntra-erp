// ====================================
// src/models/ContaPagar.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const ContaPagar = sequelize.define('ContaPagar', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    fornecedor_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    compra_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    numero_documento: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    data_emissao: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    data_vencimento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    valor_original: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    valor_pago: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0.00
    },
    valor_saldo: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    juros: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0.00
    },
    desconto: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1,
      comment: '1=Pendente, 2=Pago Parcial, 3=Pago, 4=Vencido, 5=Cancelado'
    }
  }, {
    tableName: 'contas_pagar',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['fornecedor_id'] },
      { fields: ['data_vencimento'] },
      { fields: ['status'] }
    ]
  });

  ContaPagar.associate = function(models) {
    ContaPagar.belongsTo(models.Fornecedor, { foreignKey: 'fornecedor_id', as: 'fornecedor' });
    ContaPagar.belongsTo(models.Compra, { foreignKey: 'compra_id', as: 'compra' });
  };

  return ContaPagar;
};