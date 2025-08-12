const { Sequelize } = require('sequelize');

console.log('🔧 Iniciando configuração do banco de dados...');

// 🔐 Nova DATABASE_URL fornecida
const DATABASE_URL = 'mysql://d0irknx77l637jvkex8g:pscale_pw_cXYZg0v3waSCzyliZIMw18PTEpW1Ov4h1tIjbK4oRIk@aws.connect.psdb.cloud/syntra-erp?ssl={"rejectUnauthorized":true}';

// ⚠️ Extração manual da URL para evitar erros de parsing do SSL
let username, password, host, database, port;

try {
  const url = new URL(DATABASE_URL);
  username = url.username;
  password = decodeURIComponent(url.password); // Decodifica caracteres especiais na senha
  host = url.hostname;
  database = url.pathname.slice(1) || 'syntra-erp'; // Remove a barra inicial
  port = parseInt(url.port) || 3306;

  console.log('✅ URL do banco analisada com sucesso');
  console.log('📋 Configurações extraídas:');
  console.log(`   🔹 Host: ${host}`);
  console.log(`   🔹 Database: ${database}`);
  console.log(`   🔹 Username: ${username}`);
  console.log(`   🔹 Port: ${port}`);
  console.log(`   🔹 SSL na URL: ${url.searchParams.get('ssl') || 'presente (formato JSON)'}`);
} catch (error) {
  console.error('❌ Erro ao processar DATABASE_URL:', error.message);
  process.exit(1);
}

// ✅ Configuração do Sequelize com SSL manual (evita erro de "Unknown SSL profile")
const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true // Verifica o certificado (obrigatório para PlanetScale)
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

// 🔁 Função para testar a conexão com logs detalhados
async function testConnection() {
  console.log('🔄 Tentando conectar ao PlanetScale...');

  try {
    console.log('📡 Executando sequelize.authenticate()...');
    await sequelize.authenticate();

    console.log('✅✅ CONEXÃO COM O BANCO DE DADOS ESTABELECIDA COM SUCESSO!');
    console.log('📊 Informações da conexão:');
    console.log(`   ├── Banco: ${database}`);
    console.log(`   ├── Host: ${host}:${port}`);
    console.log(`   ├── Usuário: ${username}`);
    console.log(`   ├── SSL: Ativo (rejectUnauthorized: true)`);
    console.log(`   └── Ambiente: ${process.env.NODE_ENV || 'production'}`);

    // Teste de consulta simples
    console.log('🔍 Executando query de teste: SELECT 1 + 1 AS result');
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    console.log('💡 Resultado do teste:', results[0]);

  } catch (error) {
    console.error('❌❌ FALHA NA CONEXÃO COM O BANCO DE DADOS!');
    console.error('📝 Mensagem:', error.message);
    if (error.original) {
      console.error('🔐 Erro original:', error.original.message);
      console.error('🔖 Código do erro:', error.original.code);
    } else {
      console.error('🔖 Código do erro:', error.code);
    }
    console.error('🛠️ Dica: Verifique se:');
    console.error('   1. A DATABASE_URL está correta e não foi revogada no PlanetScale');
    console.error('   2. O banco "syntra-erp" está ativo e na branch principal');
    console.error('   3. O token (pscale_pw_...) ainda é válido');
    console.error('   4. Você está usando Node.js 18+ e mysql2 atualizado');

    // Interrompe o app se não conseguir conectar
    process.exit(1);
  }
}

// 🚀 Executa o teste de conexão (exceto em testes)
if (process.env.NODE_ENV !== 'test') {
  console.log('🚀 Iniciando em ambiente:', process.env.NODE_ENV || 'production');
  testConnection();
} else {
  console.log('🧪 Modo teste - conexão não será testada automaticamente');
}

// 🔗 Hooks para monitoramento
sequelize.addHook('afterConnect', () => {
  console.log('🔗 Nova conexão com o banco foi estabelecida');
});

sequelize.addHook('beforeDisconnect', () => {
  console.log('🔌 Uma conexão com o banco será encerrada');
  
});

console.log('📦 Módulo database.js carregado com sucesso');

module.exports = sequelize;
