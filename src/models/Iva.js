// ====================================
// src/models/Iva.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const Iva = sequelize.define('Iva', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Ex: Isento, 16%, 3.5%'
    },
    codigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Código para AT'
    },
    taxa: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      comment: 'Taxa em percentual'
    },
    tipo: {
      type: DataTypes.ENUM('isento', 'normal', 'reduzida', 'especial'),
      allowNull: false,
      defaultValue: 'normal'
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    regime_tributario: {
      type: DataTypes.ENUM('geral', 'simplificado', 'isento'),
      defaultValue: 'geral'
    },
    aplicacao_automatica: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    data_fim: {
      type: DataTypes.DATE,
      allowNull: true
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cor: {
      type: DataTypes.STRING(7),
      allowNull: true,
      comment: 'Cor em hexadecimal'
    },
    requer_justificacao: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Se isento, requer justificação'
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1
    }
  }, {
    tableName: 'ivas',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['taxa'] }
    ]
  });

  return Iva;
};