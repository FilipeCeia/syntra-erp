const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false,
    // Adicionar configurações específicas para PlanetScale
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
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
  // Configurações adicionais para produção
  retry: {
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ESOCKETTIMEDOUT/,
      /EHOSTUNREACH/,
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
});

// Testar conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PlanetScale estabelecida com sucesso!');
    console.log('📊 Banco: syntra-erp (PlanetScale)');
  } catch (error) {
    console.error('❌ Erro na conexão com PlanetScale:', error.message);
    console.error('🔍 Verifique se a DATABASE_URL está correta no .env');
    console.error('💡 Detalhes do erro:', error);
  }
}

if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

module.exports = sequelize;
