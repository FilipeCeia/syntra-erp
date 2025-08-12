const { Sequelize } = require('sequelize');

console.log('🔧 Iniciando configuração do banco de dados...');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Erro: DATABASE_URL não está definida!');
  process.exit(1);
}

console.log('📋 Usando DATABASE_URL para conexão com o banco de dados.');

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true // Força verificação do certificado
    }
  },
  logging: (sql) => {
    console.log('🔍 SQL Query:', sql.substring(0, 100) + '...');
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /SequelizeConnectionError/
    ],
    max: 3
  },
  connectTimeout: 60000
});

console.log('⚙️ Sequelize instanciado com sucesso');

async function testConnection() {
  console.log('🔄 Tentando conectar ao PlanetScale...');
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PlanetScale estabelecida com sucesso!');
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    console.log('🔢 Teste SQL:', results[0]);
  } catch (error) {
    console.error('❌ FALHA NA CONEXÃO COM O BANCO DE DADOS!');
    console.error('📝 Mensagem:', error.message);
    console.error('🔍 Código:', error.original?.code || error.code);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  console.log('🚀 Ambiente:', process.env.NODE_ENV || 'development');
  testConnection();
} else {
  console.log('🧪 Modo teste - conexão não será testada automaticamente');
}

sequelize.addHook('afterConnect', () => {
  console.log('🔗 Nova conexão estabelecida');
});

console.log('📦 Módulo database.js carregado com sucesso');

module.exports = sequelize;
