require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const moment = require('moment');
const expressLayouts = require('express-ejs-layouts'); // ADICIONAR ESTA LINHA

// Configurar moment para português
moment.locale('pt');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando SYNTRA ERP...');

// Configurações do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// CONFIGURAR LAYOUTS
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // layout padrão
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Configuração de sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'syntra-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

app.use(flash());

// Middleware global para templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.messages = req.flash();
  res.locals.moment = moment;
  res.locals.currentPath = req.path;
  next();
});

// Importar modelos
const User = require('./src/models/User');
const Cliente = require('./src/models/Cliente');

// Rotas
app.use('/auth', require('./src/routes/auth'));
app.use('/dashboard', require('./src/routes/dashboard'));
app.use('/pessoas', require('./src/routes/pessoas'));
app.use('/admin-clientes', require('./src/routes/admin'));
app.use('/plataforma', require('./src/routes/plataforma'));
app.use('/faturacao', require('./src/routes/faturacao'));
app.use('/relatorios-globais', require('./src/routes/relatoriosGlobais'));
app.use('/pos', require('./src/routes/pos'));
app.use('/artigos', require('./src/routes/artigos'));
app.use('/compras', require('./src/routes/compras'));
app.use('/estoque', require('./src/routes/estoque'));
app.use('/vendas', require('./src/routes/vendas'));
app.use('/financas', require('./src/routes/financas'));
app.use('/configuracoes', require('./src/routes/configuracoes'));
app.use('/lojas', require('./src/routes/lojas'));
app.use('/relatorios', require('./src/routes/relatorios'));
app.use('/empresa', require('./src/routes/empresa'));
app.use('/sistema', require('./src/routes/sistema'));

// Rota raiz
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

// 404
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Página não encontrada</h1>
    <p>A página ${req.path} não existe.</p>
    <a href="/">Voltar ao início</a>
  `);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).send(`
    <h1>500 - Erro interno</h1>
    <p>Algo deu errado no servidor.</p>
    <pre>${err.message}</pre>
  `);
});

// Inicializar banco de dados e servidor
async function startServer() {
  try {
    const sequelize = require('./src/config/database');
        
    // Testar conexão
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida');
        
    // Sincronizar modelos (criar tabelas)
    await sequelize.sync({ force: false });
    console.log('✅ Tabelas sincronizadas');
        
    // Criar super admin e dados exemplo
    const createSuperAdmin = require('./src/database/seeders/adminSeeder');
    await createSuperAdmin();
        
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Login: http://localhost:${PORT}/auth/login`);
      console.log(`🎯 Dashboard: http://localhost:${PORT}/dashboard`);
      console.log(`📧 Admin: admin@syntra.co.mz / admin123`);
    });
      
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();