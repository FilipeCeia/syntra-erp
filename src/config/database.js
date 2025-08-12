const { Sequelize } = require('sequelize');

console.log('🔧 Iniciando configuração do banco de dados...');

// 🌐 Usa DATABASE_URL diretamente das variáveis de ambiente
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Erro: DATABASE_URL não está definida nas variáveis de ambiente!');
  process.exit(1);
}

console.log('📋 Usando DATABASE_URL para conexão com o banco de dados.');

// ✅ Configuração do Sequelize usando a DATABASE_URL
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true // Essencial para PlanetScale
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
  // ⚠️ Timeout de conexão (em ms)
  connectTimeout: 60000
});

console.log('⚙️ Sequelize instanciado com sucesso');

// 🔁 Função para testar a conexão (opcional em produção)
async function testConnection() {
  console.log('🔄 Tentando conectar ao PlanetScale...');

  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PlanetScale estabelecida com sucesso!');

    // Teste simples
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    console.log('🔢 Query teste bem-sucedida:', results[0]);

  } catch (error) {
    console.error('❌ FALHA NA CONEXÃO COM O BANCO DE DADOS!');
    console.error('📝 Mensagem:', error.message);
    console.error('🔍 Código:', error.original?.code || error.code);
    console.error('🛠️ Dica: Verifique se a DATABASE_URL está correta e ativa no PlanetScale.');

    // Interrompe o app se não conseguir conectar
    process.exit(1);
  }
}

// 🚀 Executa o teste de conexão apenas se não for ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  console.log('🚀 Ambiente:', process.env.NODE_ENV || 'development');
  testConnection();
} else {
  console.log('🧪 Modo teste - conexão não será testada automaticamente');
}

// 🔗 Hooks para monitorar conexões (opcional)
sequelize.addHook('afterConnect', () => {
  console.log('🔗 Nova conexão ao banco estabelecida');
});

sequelize.addHook('beforeDisconnect', () => {
  console.log('🔌 Conexão será encerrada');
});

console.log('📦 Módulo database.js carregado com sucesso');

module.exports = sequelize;
