class RelatoriosController {
  // Vendas por Período
  async vendasPorPeriodo(req, res) {
    try {
      const { data_inicio = '', data_fim = '', loja_id = '' } = req.query;
      
      // Dados fictícios para vendas por período
      const vendasData = {
        periodo: `${data_inicio || '01/01/2024'} - ${data_fim || '31/01/2024'}`,
        resumo: {
          total_vendas: 342150.75,
          total_transacoes: 1456,
          ticket_medio: 234.89,
          crescimento: 8.5
        },
        vendas_diarias: [
          { data: '2024-01-01', vendas: 12500.00, transacoes: 45 },
          { data: '2024-01-02', vendas: 15200.50, transacoes: 52 },
          { data: '2024-01-03', vendas: 9800.25, transacoes: 38 },
          { data: '2024-01-04', vendas: 18750.00, transacoes: 67 },
          { data: '2024-01-05', vendas: 22100.75, transacoes: 78 }
        ],
        vendas_por_categoria: [
          { categoria: 'Eletrônicos', vendas: 125430.20, participacao: 36.7 },
          { categoria: 'Roupas', vendas: 98750.30, participacao: 28.9 },
          { categoria: 'Casa & Jardim', vendas: 76890.15, participacao: 22.5 },
          { categoria: 'Outros', vendas: 41080.10, participacao: 12.0 }
        ]
      };

      const breadcrumbs = [
        { texto: 'Início', link: '/dashboard' },
        { texto: 'Relatórios', link: '/relatorios' },
        { texto: 'Vendas por Período', link: '' }
      ];

      res.render('relatorios/vendas-periodo', {
        title: 'Vendas por Período',
        breadcrumbs,
        vendasData,
        filtros: { data_inicio, data_fim, loja_id },
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao carregar vendas por período:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Vendas por Cliente
  async vendasPorCliente(req, res) {
    try {
      const { data_inicio = '', data_fim = '', cliente_id = '' } = req.query;
      
      const vendasClientes = {
        periodo: `${data_inicio || '01/01/2024'} - ${data_fim || '31/01/2024'}`,
        top_clientes: [
          { nome: 'João Silva', nuit: '123456789', total_vendas: 45230.50, total_documentos: 12 },
          { nome: 'Maria Costa', nuit: '987654321', total_vendas: 38750.20, total_documentos: 8 },
          { nome: 'Pedro Langa', nuit: '456789123', total_vendas: 32100.80, total_documentos: 15 },
          { nome: 'Ana Machel', nuit: '789123456', total_vendas: 28900.45, total_documentos: 6 },
          { nome: 'Carlos Mondlane', nuit: '321654987', total_vendas: 25600.30, total_documentos: 9 }
        ],
        resumo: {
          total_clientes: 156,
          total_vendas: 170581.25,
          ticket_medio: 1093.46
        }
      };

      const breadcrumbs = [
        { texto: 'Início', link: '/dashboard' },
        { texto: 'Relatórios', link: '/relatorios' },
        { texto: 'Vendas por Cliente', link: '' }
      ];

      res.render('relatorios/vendas-cliente', {
        title: 'Vendas por Cliente',
        breadcrumbs,
        vendasClientes,
        filtros: { data_inicio, data_fim, cliente_id },
        formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
      });
    } catch (error) {
      console.error('Erro ao carregar vendas por cliente:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }

  // Vendas por Artigo
  async vendasPorArtigo(req, res) {
    try {
      const { data_inicio = '', data_fim = '', categoria_id = '' } = req.query;
      
      const vendasArtigos = {
        periodo: `${data_inicio || '01/01/2024'} - ${data_fim || '31/01/2024'}`,
        top_artigos: [
          { nome: 'Smartphone Samsung A54', codigo: 'SAMS-A54', quantidade: 45, valor_total: 67500.00, valor_unitario: 1500.00 },
          { nome: 'Notebook Dell Inspiron', codigo: 'DELL-INS', quantidade: 12, valor_total: 36000.00, valor_unitario: 3000.00 },
          { nome: 'Fones Bluetooth JBL', codigo: 'JBL-BT', quantidade: 89, valor_total: 22250.00, valor_unitario: 250.00 },
          { nome: 'Monitor LG 24"', codigo: 'LG-24', quantidade: 32, valor_total: 19200.00, valor_unitario: 600.00 },
          { nome: 'Teclado Mecânico', codigo: 'TEC-MEC', quantidade: 67, valor_total: 16750.00, valor_unitario: 250.00 }
        ],
resumo: {
  totalArtigos: 245,        
  quantidadeVendida: 1234,  
  valorTotal: 161700.00     
}
      };

      const breadcrumbs = [
        { texto: 'Início', link: '/dashboard' },
        { texto: 'Relatórios', link: '/relatorios' },
        { texto: 'Vendas por Artigo', link: '' }
      ];

res.render('relatorios/vendas-artigo', {
  title: 'Vendas por Artigo',
  breadcrumbs,
  resumo: vendasArtigos.resumo,
  artigos: vendasArtigos.top_artigos,  // Adicionar esta linha
  vendasArtigos,
  filtros: { data_inicio, data_fim, categoria_id },
  formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
});
    } catch (error) {
      console.error('Erro ao carregar vendas por artigo:', error);
      res.status(500).render('error', { message: 'Erro interno do servidor' });
    }
  }


  async comprasPorPeriodo(req, res) {
  try {
    const { data_inicio = '', data_fim = '', fornecedor_id = '' } = req.query;
    
    const resumo = {
      totalCompras: 156,
      valorTotal: '1.245.780,50 MT',
      ticketMedio: '7.985,39 MT',
      totalFornecedores: 12
    };

    const compras = [
      {
        data: new Date('2024-01-15'),
        documento: 'FC001/2024',
        fornecedor: 'Fornecedor ABC Lda',
        valorSemIva: '38.135,59 MT',
        iva: '7.064,41 MT',
        valorTotal: '45.200,00 MT',
        estado: 'Pago'
      },
      {
        data: new Date('2024-01-16'),
        documento: 'FC002/2024',
        fornecedor: 'Tech Solutions Lda',
        valorSemIva: '57.288,14 MT',
        iva: '10.512,36 MT',
        valorTotal: '67.800,50 MT',
        estado: 'Pendente'
      },
      {
        data: new Date('2024-01-17'),
        documento: 'FC003/2024',
        fornecedor: 'Distribuidora XYZ',
        valorSemIva: '27.118,85 MT',
        iva: '4.981,40 MT',
        valorTotal: '32.100,25 MT',
        estado: 'Pago'
      }
    ];

    const graficoCompras = {
      labels: ['01/01', '02/01', '03/01', '04/01', '05/01', '06/01', '07/01'],
      valores: [45200, 67800, 32100, 89750, 125600, 78900, 95400]
    };

    const breadcrumb = [
      { name: 'Início', url: '/dashboard' },
      { name: 'Relatórios', url: '/relatorios' },
      { name: 'Compras por Período', url: '' }
    ];

    res.render('relatorios/compras-periodo', {
      title: 'Compras por Período',
      breadcrumb,
      resumo,
      compras,
      graficoCompras,  // Adicionar esta linha
      comprasData: {},  // Manter para compatibilidade
      filtros: { data_inicio, data_fim, fornecedor_id },
      formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
    });
  } catch (error) {
    console.error('Erro ao carregar compras por período:', error);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
}

  // Posição de Estoque

  async posicaoEstoque(req, res) {
  try {
    const { categoria = '', situacao = '', loja = '' } = req.query;
    
    const resumo = {
      totalArtigos: 1247,
      valorEstoque: '2.845.670,25 MT',
      estoqueBaixo: 23,
      estoqueZerado: 8
    };

    const estoque = [
      {
        codigo: 'ART001',
        nome: 'Smartphone Samsung Galaxy',
        categoria: 'Eletrônicos',
        loja: 'Loja Principal',
        quantidade: 45,
        estoqueMinimo: 10,
        custoUnitario: '15.500,00 MT',
        valorTotal: '697.500,00 MT',
        situacao: 'Normal'
      },
      {
        codigo: 'ART002',
        nome: 'Notebook Dell Inspiron',
        categoria: 'Eletrônicos',
        loja: 'Loja Shopping',
        quantidade: 8,
        estoqueMinimo: 5,
        custoUnitario: '35.000,00 MT',
        valorTotal: '280.000,00 MT',
        situacao: 'Normal'
      },
      {
        codigo: 'ART003',
        nome: 'Camiseta Polo',
        categoria: 'Roupas',
        loja: 'Loja Centro',
        quantidade: 3,
        estoqueMinimo: 15,
        custoUnitario: '450,00 MT',
        valorTotal: '1.350,00 MT',
        situacao: 'Baixo'
      },
      {
        codigo: 'ART004',
        nome: 'Mesa de Jantar',
        categoria: 'Casa e Jardim',
        loja: 'Loja Principal',
        quantidade: 0,
        estoqueMinimo: 2,
        custoUnitario: '8.500,00 MT',
        valorTotal: '0,00 MT',
        situacao: 'Zerado'
      }
    ];

    const graficoEstoque = {
      labels: ['Eletrônicos', 'Roupas', 'Casa e Jardim', 'Livros', 'Esportes'],
      valores: [1250000, 850000, 450000, 180000, 115670]
    };

    const breadcrumb = [
      { name: 'Início', url: '/dashboard' },
      { name: 'Relatórios', url: '/relatorios' },
      { name: 'Posição de Estoque', url: '' }
    ];

    res.render('relatorios/posicao-estoque', {
      title: 'Posição de Estoque',
      breadcrumb,
      resumo,
      estoque,
      graficoEstoque,
      filtros: { categoria, situacao, loja },
      formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
    });
  } catch (error) {
    console.error('Erro ao carregar posição de estoque:', error);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
}


async fluxoCaixa(req, res) {
  try {
    const { dataInicio = '', dataFim = '' } = req.query;
    
    const resumo = {
      totalEntradas: '1.850.450,75 MT',
      totalSaidas: '1.245.680,30 MT',
      saldoLiquido: '604.770,45 MT',
      saldoAtual: '2.450.320,15 MT'
    };

    const entradas = [
      {
        data: new Date('2024-01-15'),
        descricao: 'Venda de Produtos',
        valor: '125.450,00 MT'
      },
      {
        data: new Date('2024-01-16'),
        descricao: 'Recebimento de Cliente',
        valor: '89.750,50 MT'
      },
      {
        data: new Date('2024-01-17'),
        descricao: 'Venda à Vista',
        valor: '67.890,25 MT'
      },
      {
        data: new Date('2024-01-18'),
        descricao: 'Transferência Bancária',
        valor: '156.780,00 MT'
      }
    ];

    const saidas = [
      {
        data: new Date('2024-01-15'),
        descricao: 'Pagamento Fornecedor',
        valor: '85.450,00 MT'
      },
      {
        data: new Date('2024-01-16'),
        descricao: 'Despesas Operacionais',
        valor: '45.680,30 MT'
      },
      {
        data: new Date('2024-01-17'),
        descricao: 'Salários',
        valor: '125.000,00 MT'
      },
      {
        data: new Date('2024-01-18'),
        descricao: 'Aluguel',
        valor: '35.000,00 MT'
      }
    ];

    const graficoFluxo = {
      labels: ['01/01', '02/01', '03/01', '04/01', '05/01', '06/01', '07/01'],
      entradas: [125450, 89750, 67890, 156780, 98450, 134560, 177570],
      saidas: [85450, 45680, 125000, 35000, 67890, 89450, 123670],
      saldoAcumulado: [40000, 84070, 26960, 148740, 179300, 224410, 278310]
    };

    const breadcrumb = [
      { name: 'Início', url: '/dashboard' },
      { name: 'Relatórios', url: '/relatorios' },
      { name: 'Fluxo de Caixa', url: '' }
    ];

    res.render('relatorios/fluxo-caixa', {
      title: 'Fluxo de Caixa',
      breadcrumb,
      resumo,
      entradas,
      saidas,
      graficoFluxo,
      filtros: { dataInicio, dataFim },
      formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
    });
  } catch (error) {
    console.error('Erro ao carregar fluxo de caixa:', error);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
}

  // Relatório de IVA

  // Relatório de IVA
async relatorioIva(req, res) {
  try {
    const { mes = new Date().getMonth() + 1, ano = new Date().getFullYear(), tipo = '' } = req.query;
    
    // Dados de resumo do IVA
    const resumo = {
      ivaAPagar: '34.854,50 MT',
      ivaAReceber: '19.890,50 MT', 
      saldoIva: '14.964,00 MT',
      totalOperacoes: '1.456'
    };

    // Dados de IVA das vendas
    const ivaVendas = [
      { taxa: '17', baseTributavel: '285.125,75 MT', valorIva: '48.471,38 MT' },
      { taxa: '16', baseTributavel: '57.025,00 MT', valorIva: '9.124,00 MT' },
      { taxa: '0', baseTributavel: '15.000,00 MT', valorIva: '0,00 MT' }
    ];

    // Dados de IVA das compras
    const ivaCompras = [
      { taxa: '17', baseTributavel: '98.250,50 MT', valorIva: '16.702,59 MT' },
      { taxa: '16', baseTributavel: '26.065,00 MT', valorIva: '4.170,40 MT' },
      { taxa: '0', baseTributavel: '8.500,00 MT', valorIva: '0,00 MT' }
    ];

    // Totais das vendas
    const totalVendas = {
      baseTributavel: '357.150,75 MT',
      valorIva: '57.595,38 MT'
    };

    // Totais das compras
    const totalCompras = {
      baseTributavel: '132.815,50 MT',
      valorIva: '20.872,99 MT'
    };

    // Breadcrumb corrigido
    const breadcrumb = [
      { name: 'Início', url: '/dashboard' },
      { name: 'Relatórios', url: '/relatorios' },
      { name: 'Relatório de IVA', url: '' }
    ];

    res.render('relatorios/relatorio-iva', {
      title: 'Relatório de IVA',
      breadcrumb,
      resumo,
      ivaVendas,
      ivaCompras,
      totalVendas,
      totalCompras, 
      filtros: { mes, ano, tipo },
      formatCurrency: (value) => `${value.toLocaleString('pt-MZ')} MT`
    });
  } catch (error) {
    console.error('Erro ao carregar relatório de IVA:', error);
    res.status(500).render('error', { message: 'Erro interno do servidor' });
  }
}





}

///nder('relatorios/vendas-art

//uantidade_vendid
module.exports = RelatoriosController;