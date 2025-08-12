const { Sequelize } = require('sequelize');

console.log('🔧 Iniciando configuração do banco de dados...');

// 🔐 Colocando a DATABASE_URL diretamente (APENAS PARA TESTE)
const DATABASE_URL = 'mysql://8umu7fr951uscsla0ua8:pscale_pw_7UBbseoV44DJbSTAAcUR7jlXI548oODhwgfoX79CXBL@aws.connect.psdb.cloud/syntra-erp';

// Extraímos manualmente as partes
const url = new URL(DATABASE_URL);
const username = url.username;
const password = decodeURIComponent(url.password); // Decodifica caracteres especiais
const host = url.hostname;
const database = url.pathname.slice(1); // Remove a barra inicial
const port = url.port || 3306;

console.log('📋 Configurações extraídas:');
console.log(`   Host: ${host}`);
console.log(`   Database: ${database}`);
console.log(`   Username: ${username}`);
console.log(`   Port: ${port}`);
console.log(`   Password: ${password.substring(0, 10)}...`);

// ✅ Criação da instância Sequelize com SSL configurado manualmente
const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true
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
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeConnectionTimedOutError/
    ],
    max: 3
  },
  connectTimeout: 60000
});

console.log('⚙️ Sequelize instanciado com sucesso');

// 🔁 Teste de conexão
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
    console.error('🔐 Stack:', error.stack);
    process.exit(1); // Interrompe o app se não conectar
  }
}

// 🚀 Executa o teste
if (process.env.NODE_ENV !== 'test') {
  console.log('🚀 Ambiente:', process.env.NODE_ENV || 'development');
  testConnection();
} else {
  console.log('🧪 Modo teste - conexão não será testada automaticamente');
}

// 🔗 Hooks
sequelize.addHook('afterConnect', () => {
  console.log('🔗 Nova conexão estabelecida');
});

console.log('📦 Módulo database.js carregado com sucesso');

module.exports = sequelize;
