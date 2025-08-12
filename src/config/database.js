const { Sequelize } = require('sequelize');

console.log('🔧 Iniciando configuração do banco de dados...');

// Dados de conexão diretos (extraídos da sua URL)
const DB_CONFIG = {
  username: '5ka8560r5c3a0tdlmrvj',
  password: 'pscale_pw_E9Vlz5kwLlx6LKm8VQwapaaf71S5Tt0sPlFs9l67ssd',
  host: 'aws.connect.psdb.cloud',
  database: 'syntra-erp',
  port: 3306
};

console.log('📋 Configurações do banco:');
console.log(`   Host: ${DB_CONFIG.host}`);
console.log(`   Database: ${DB_CONFIG.database}`);
console.log(`   Username: ${DB_CONFIG.username}`);
console.log(`   Port: ${DB_CONFIG.port}`);
console.log(`   Password: ${DB_CONFIG.password.substring(0, 10)}...`);

// Criando conexão Sequelize
const sequelize = new Sequelize(
  DB_CONFIG.database,
  DB_CONFIG.username,
  DB_CONFIG.password,
  {
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
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
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    },
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ESOCKETTIMEDOUT/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      max: 3
    }
  }
);

console.log('⚙️ Sequelize instanciado com sucesso');

// Função para testar conexão com logs detalhados
async function testConnection() {
  console.log('🔄 Tentando conectar ao PlanetScale...');
  
  try {
    // Teste de autenticação
    console.log('📡 Executando authenticate()...');
    await sequelize.authenticate();
    
    console.log('✅ Conexão com PlanetScale estabelecida com sucesso!');
    console.log('📊 Detalhes da conexão:');
    console.log(`   ├── Host: ${DB_CONFIG.host}`);
    console.log(`   ├── Database: ${DB_CONFIG.database}`);
    console.log(`   ├── Dialect: mysql`);
    console.log(`   ├── SSL: Ativo (require: true, rejectUnauthorized: false)`);
    console.log(`   └── Pool: max=5, min=0`);
    
    // Teste de query simples
    try {
      console.log('🔍 Testando query simples...');
      const [results] = await sequelize.query('SELECT 1 as test');
      console.log('✅ Query teste executada:', results);
    } catch (queryError) {
      console.log('⚠️ Erro na query teste:', queryError.message);
    }
    
  } catch (error) {
    console.error('❌ ERRO na conexão com PlanetScale!');
    console.error('📝 Detalhes do erro:');
    console.error(`   ├── Tipo: ${error.constructor.name}`);
    console.error(`   ├── Mensagem: ${error.message}`);
    console.error(`   ├── Code: ${error.code || 'N/A'}`);
    console.error(`   └── SQL State: ${error.sqlState || 'N/A'}`);
    
    if (error.original) {
      console.error('🔍 Erro original:');
      console.error(`   ├── Tipo: ${error.original.constructor.name}`);
      console.error(`   ├── Mensagem: ${error.original.message}`);
      console.error(`   └── Code: ${error.original.code || 'N/A'}`);
    }
    
    // Sugestões de troubleshooting
    console.error('🛠️ Possíveis soluções:');
    console.error('   1. Verifique se as credenciais estão corretas');
    console.error('   2. Verifique se o banco "syntra-erp" existe no PlanetScale');
    console.error('   3. Verifique se a connection string está ativa');
    console.error('   4. Verifique se há firewall bloqueando a conexão');
  }
}

// Executar teste apenas se não for ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  console.log('🚀 Ambiente:', process.env.NODE_ENV || 'development');
  testConnection();
} else {
  console.log('🧪 Modo teste - conexão não será testada automaticamente');
}

// Event listeners para monitorar conexão (usando hooks do Sequelize)
sequelize.addHook('afterConnect', () => {
  console.log('🔗 Nova conexão estabelecida');
});

sequelize.addHook('beforeDisconnect', () => {
  console.log('🔌 Conexão será desconectada');
});

console.log('📦 Módulo database.js carregado com sucesso');

module.exports = sequelize;
