// ====================================
// src/models/Categoria.js
// ====================================
module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    categoria_pai: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: 'Para criar hierarquia'
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meta_title: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cor: {
      type: DataTypes.STRING(7),
      allowNull: true,
      comment: 'Cor em hexadecimal'
    },
    ordem: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1
    }
  }, {
    tableName: 'categorias',
    indexes: [
      { fields: ['client_id'] },
      { fields: ['categoria_pai'] }
    ]
  });

  Categoria.associate = function(models) {
    Categoria.hasMany(models.Categoria, { foreignKey: 'categoria_pai', as: 'subcategorias' });
    Categoria.belongsTo(models.Categoria, { foreignKey: 'categoria_pai', as: 'parent' });
    Categoria.hasMany(models.Artigo, { foreignKey: 'categoria_id', as: 'artigos' });
  };

  return Categoria;
};