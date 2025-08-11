module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  client_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    defaultValue: 1
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  nuit: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true
  },
  tipo: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 1,
    comment: '1=Particular, 2=Empresa'
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  endereco: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  limite_credito: {
    type: DataTypes.DECIMAL(15,2),
    defaultValue: 0.00
  },
  saldo_conta: {
    type: DataTypes.DECIMAL(15,2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 1
  }
}, {
  tableName: 'clientes',
  indexes: [
    { fields: ['client_id'] },
    { fields: ['codigo'] },
    { fields: ['nome'] }
  ]
});

  return Cliente;
};