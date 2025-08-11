const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Cliente = require('../../models/Cliente');

async function createSuperAdmin() {
  try {
    console.log('🔧 Criando super admin...');
    
    // Verificar se já existe
    const existingAdmin = await User.findOne({
      where: { email: 'admin@syntra.co.mz' }
    });

    if (existingAdmin) {
      console.log('✅ Super admin já existe');
      return;
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Criar super admin
    await User.create({
      client_id: 1,
      nome: 'Super Administrador',
      email: 'admin@syntra.co.mz',
      senha: hashedPassword,
      perfil: 1,
      status: 1
    });

    console.log('✅ Super admin criado!');
    console.log('📧 Email: admin@syntra.co.mz');
    console.log('🔑 Senha: admin123');

    // Criar alguns clientes de exemplo
    await createSampleData();

  } catch (error) {
    console.error('❌ Erro ao criar super admin:', error);
  }
}

async function createSampleData() {
  try {
    // Criar clientes de exemplo
    const clientes = [
      {
        client_id: 1,
        codigo: 'CLI000001',
        nome: 'João da Silva',
        tipo: 1,
        telefone: '258123456789',
        email: 'joao@email.com',
        limite_credito: 5000.00,
        status: 1
      },
      {
        client_id: 1,
        codigo: 'CLI000002',
        nome: 'Empresa ABC Lda',
        nuit: 123456789,
        tipo: 2,
        telefone: '258987654321',
        email: 'empresa@abc.co.mz',
        limite_credito: 50000.00,
        status: 1
      },
      {
        client_id: 1,
        codigo: 'CLI000003',
        nome: 'Maria Santos',
        tipo: 1,
        telefone: '258111222333',
        limite_credito: 2500.00,
        status: 1
      }
    ];

    for (const clienteData of clientes) {
      await Cliente.findOrCreate({
        where: { codigo: clienteData.codigo },
        defaults: clienteData
      });
    }

    console.log('✅ Dados de exemplo criados');
  } catch (error) {
    console.error('❌ Erro ao criar dados exemplo:', error);
  }
}

module.exports = createSuperAdmin;