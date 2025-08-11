// ====================================
// src/models/Artigo.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const Artigo = sequelize.define('Artigo', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    categoria_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    iva_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Código interno'
    },
    codigo_barras: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nome: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    unidade_medida: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'UN'
    },
    preco_custo: {
      type: DataTypes.DECIMAL(15,4),
      defaultValue: 0.0000
    },
    preco_venda: {
      type: DataTypes.DECIMAL(15,4),
      allowNull: false
    },
    margem_lucro: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0.00,
      comment: 'Percentual de margem'
    },
    desconto_maximo: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0.00
    },
    stock_minimo: {
      type: DataTypes.DECIMAL(10,2),
      defaultValue: 0.00
    },
    stock_maximo: {
      type: DataTypes.DECIMAL(10,2),
      defaultValue: 0.00
    },
    stock_atual: {
      type: DataTypes.DECIMAL(10,2),
      defaultValue: 0.00
    },
    tipo: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1,
      comment: '1=Produto, 2=Serviço'
    },
    controla_stock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    permite_venda_sem_stock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    usa_imagem: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    imagem: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    justificacao_isencao: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Obrigatório se IVA isento'
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1
    }
  }, {
    tableName: 'artigos',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['categoria_id'] },
      { fields: ['iva_id'] },
      { fields: ['codigo'] },
      { fields: ['codigo_barras'] },
      { fields: ['nome'] }
    ]
  });

  Artigo.associate = function(models) {
    Artigo.belongsTo(models.Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
    Artigo.belongsTo(models.Iva, { foreignKey: 'iva_id', as: 'iva' });
  };

  return Artigo;
};
