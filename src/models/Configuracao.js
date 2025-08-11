// ====================================
// src/models/Configuracao.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const Configuracao = sequelize.define('Configuracao', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    chave: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    valor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(20),
      defaultValue: 'string',
      comment: 'string, number, boolean, json'
    }
  }, {
    tableName: 'configuracoes',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['chave'] },
      { fields: ['client_id', 'chave'], unique: true }
    ]
  });

  return Configuracao;
};