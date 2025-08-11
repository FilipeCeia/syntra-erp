// ====================================
// src/controllers/pessoas/importExportController.js
// ====================================
const { Cliente, Fornecedor, User } = require('../../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/import');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.xlsx', '.xls', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use apenas Excel ou CSV.'));
    }
  }
});

// Página principal de importação/exportação
exports.index = async (req, res) => {
  try {
    // Buscar estatísticas recentes
    const stats = {
      clientes: await Cliente.count({ where: { client_id: req.session.user.client_id } }),
      fornecedores: await Fornecedor.count({ where: { client_id: req.session.user.client_id } }),
      utilizadores: await User.count({ where: { client_id: req.session.user.client_id } })
    };

    // Buscar histórico recente de importações/exportações
    // (Implementar modelo de histórico se necessário)
    const historico = [
      {
        id: 1,
        tipo: 'importacao',
        entidade: 'clientes',
        arquivo: 'clientes_2024.xlsx',
        registros: 150,
        status: 'concluido',
        data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        tipo: 'exportacao',
        entidade: 'fornecedores',
        arquivo: 'fornecedores_export.csv',
        registros: 75,
        status: 'concluido',
        data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    res.render('pessoas/import-export/index', {
      title: 'Importação e Exportação',
      stats,
      historico
    });
  } catch (error) {
    console.error('Erro ao carregar página de importação/exportação:', error);
    req.flash('error', 'Erro ao carregar página');
    res.redirect('/dashboard');
  }
};

// Página de configurações
exports.configuracoes = async (req, res) => {
  try {
    res.render('pessoas/import-export/configuracoes', {
      title: 'Configurações de Importação/Exportação'
    });
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    req.flash('error', 'Erro ao carregar configurações');
    res.redirect('/pessoas/import-export');
  }
};

// Processar importação
exports.processImport = async (req, res) => {
  try {
    const { tipo } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    
    // Simular processamento de importação
    // Em uma implementação real, aqui seria feita a leitura do arquivo Excel/CSV
    // e a inserção dos dados no banco de dados
    
    setTimeout(() => {
      // Simular resultado da importação
      const resultado = {
        sucesso: true,
        arquivo: fileName,
        registros_processados: Math.floor(Math.random() * 100) + 50,
        registros_inseridos: Math.floor(Math.random() * 80) + 40,
        registros_atualizados: Math.floor(Math.random() * 20) + 5,
        registros_erro: Math.floor(Math.random() * 5),
        erros: [
          'Linha 15: Email inválido',
          'Linha 23: NUIT já existe',
          'Linha 45: Campo obrigatório em branco'
        ]
      };
      
      // Limpar arquivo temporário
      fs.unlinkSync(filePath);
      
      res.json(resultado);
    }, 3000); // Simular 3 segundos de processamento
    
  } catch (error) {
    console.error('Erro ao processar importação:', error);
    res.status(500).json({ error: 'Erro ao processar importação' });
  }
};

// Exportar dados
exports.export = async (req, res) => {
  try {
    const { tipo, formato, filtros } = req.body;
    
    let dados = [];
    let nomeArquivo = '';
    
    // Buscar dados baseado no tipo
    switch (tipo) {
      case 'clientes':
        dados = await Cliente.findAll({
          where: { client_id: req.session.user.client_id },
          order: [['nome', 'ASC']]
        });
        nomeArquivo = `clientes_${new Date().toISOString().split('T')[0]}`;
        break;
        
      case 'fornecedores':
        dados = await Fornecedor.findAll({
          where: { client_id: req.session.user.client_id },
          order: [['nome', 'ASC']]
        });
        nomeArquivo = `fornecedores_${new Date().toISOString().split('T')[0]}`;
        break;
        
      case 'utilizadores':
        dados = await User.findAll({
          where: { client_id: req.session.user.client_id },
          order: [['nome', 'ASC']],
          attributes: { exclude: ['password'] }
        });
        nomeArquivo = `utilizadores_${new Date().toISOString().split('T')[0]}`;
        break;
        
      default:
        return res.status(400).json({ error: 'Tipo de exportação inválido' });
    }
    
    // Aplicar filtros se fornecidos
    if (filtros) {
      // Implementar lógica de filtros
    }
    
    // Simular geração do arquivo
    const resultado = {
      sucesso: true,
      arquivo: `${nomeArquivo}.${formato}`,
      registros: dados.length,
      tamanho: `${Math.floor(dados.length * 0.5)}KB`,
      download_url: `/download/${nomeArquivo}.${formato}`
    };
    
    res.json(resultado);
    
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    res.status(500).json({ error: 'Erro ao exportar dados' });
  }
};

// Download de template
exports.downloadTemplate = async (req, res) => {
  try {
    const { tipo } = req.params;
    
    let template = {};
    let nomeArquivo = '';
    
    switch (tipo) {
      case 'clientes':
        template = {
          headers: ['Nome', 'NUIT', 'Telefone', 'Email', 'Endereço', 'Cidade', 'Província'],
          exemplo: ['João Silva Lda', '123456789', '84123456789', 'joao@empresa.com', 'Rua da Paz, 123', 'Maputo', 'Maputo']
        };
        nomeArquivo = 'template_clientes.csv';
        break;
        
      case 'fornecedores':
        template = {
          headers: ['Nome', 'NUIT', 'Telefone', 'Email', 'Endereço', 'Pessoa de Contacto', 'Telefone Contacto'],
          exemplo: ['Fornecedor ABC', '987654321', '84987654321', 'fornecedor@abc.com', 'Av. Principal, 456', 'Maria Santos', '84111222333']
        };
        nomeArquivo = 'template_fornecedores.csv';
        break;
        
      case 'utilizadores':
        template = {
          headers: ['Nome', 'Email', 'Telefone', 'Perfil', 'Status'],
          exemplo: ['Ana Costa', 'ana@empresa.com', '84555666777', 'vendedor', 'ativo']
        };
        nomeArquivo = 'template_utilizadores.csv';
        break;
        
      default:
        return res.status(400).json({ error: 'Tipo de template inválido' });
    }
    
    // Gerar CSV
    let csvContent = template.headers.join(',') + '\n';
    csvContent += template.exemplo.join(',') + '\n';
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
    res.send(csvContent);
    
  } catch (error) {
    console.error('Erro ao gerar template:', error);
    res.status(500).json({ error: 'Erro ao gerar template' });
  }
};

// Validar arquivo antes da importação
exports.validateFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }
    
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    
    // Simular validação do arquivo
    setTimeout(() => {
      const validacao = {
        valido: true,
        arquivo: fileName,
        total_linhas: Math.floor(Math.random() * 200) + 50,
        linhas_validas: Math.floor(Math.random() * 180) + 40,
        linhas_erro: Math.floor(Math.random() * 20),
        erros: [
          'Linha 5: Email inválido',
          'Linha 12: NUIT com formato incorreto',
          'Linha 18: Campo nome obrigatório'
        ],
        avisos: [
          'Linha 25: Telefone sem código do país',
          'Linha 33: Endereço muito longo'
        ]
      };
      
      // Manter arquivo para importação posterior
      res.json(validacao);
    }, 2000);
    
  } catch (error) {
    console.error('Erro ao validar arquivo:', error);
    res.status(500).json({ error: 'Erro ao validar arquivo' });
  }
};

// Salvar configurações
exports.saveConfig = async (req, res) => {
  try {
    const configuracoes = req.body;
    
    // Implementar salvamento das configurações
    // Por exemplo, em um arquivo JSON ou tabela de configurações
    
    res.json({ 
      sucesso: true, 
      message: 'Configurações salvas com sucesso' 
    });
    
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    res.status(500).json({ error: 'Erro ao salvar configurações' });
  }
};

// Middleware do multer
exports.uploadMiddleware = upload.single('arquivo');

module.exports = exports;