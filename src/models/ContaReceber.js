

// src/models/ContaReceber.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const ContaReceber = sequelize.define('ContaReceber', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    cliente_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    venda_id: {
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
    valor_recebido: {
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
      comment: '1=Pendente, 2=Recebido Parcial, 3=Recebido, 4=Vencido, 5=Cancelado'
    }
  }, {
    tableName: 'contas_receber',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['cliente_id'] },
      { fields: ['data_vencimento'] },
      { fields: ['status'] }
    ]
  });

  ContaReceber.associate = function(models) {
    ContaReceber.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
    ContaReceber.belongsTo(models.Venda, { foreignKey: 'venda_id', as: 'venda' });
  };

  return ContaReceber;
};