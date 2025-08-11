// ====================================
// src/models/Estoque.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const Estoque = sequelize.define('Estoque', {
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
    artigo_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    tipo_movimento: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      comment: '1=Entrada, 2=Saída, 3=Ajuste, 4=Transferência'
    },
    documento_origem: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Número do documento que originou o movimento'
    },
    quantidade_anterior: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    quantidade: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      comment: 'Quantidade movimentada (+ ou -)'
    },
    quantidade_atual: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(15,4),
      defaultValue: 0.0000
    },
    valor_total: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0.00
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    data_movimento: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'estoques',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['artigo_id'] },
      { fields: ['tipo_movimento'] },
      { fields: ['data_movimento'] }
    ]
  });

  Estoque.associate = function(models) {
    Estoque.belongsTo(models.Artigo, { foreignKey: 'artigo_id', as: 'artigo' });
    Estoque.belongsTo(models.User, { foreignKey: 'user_id', as: 'usuario' });
    Estoque.belongsTo(models.Loja, { foreignKey: 'loja_id', as: 'loja' });
  };

  return Estoque;
};