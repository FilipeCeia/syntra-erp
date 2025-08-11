const express = require('express');

class EmpresaController {
  // Exibir dados da empresa
  async index(req, res) {
    try {
      // Dados simulados da empresa
      const empresa = {
        nome: 'SYNTRA ERP Lda',
        nuit: '400123456',
        endereco: 'Av. Vladimir Lenine, 2000',
        cidade: 'Maputo',
        provincia: 'Maputo',
        codigo_postal: '1100',
        telefone: '+258 21 123456',
        email: 'info@syntra-erp.co.mz',
        website: 'www.syntra-erp.co.mz',
        regime_iva: 'Regime Geral',
        atividade_principal: 'Desenvolvimento de Software',
        data_constituicao: '2020-01-15',
        capital_social: 100000.00,
        moeda_base: 'MZN',
        ano_fiscal: new Date().getFullYear(),
        logotipo: '/images/logo.png'
      };

      res.render('configuracoes/empresa/index', {
        title: 'Dados da Empresa - SYNTRA ERP',
        layout: 'layouts/main',
        empresa,
        breadcrumbs: [
          { name: 'Dashboard', url: '/dashboard' },
          { name: 'Configurações', url: '/configuracoes' },
          { name: 'Dados da Empresa', url: '/empresa' }
        ]
      });
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error);
      req.flash('error', 'Erro ao carregar dados da empresa');
      res.redirect('/dashboard');
    }
  }

  // Atualizar dados da empresa
  async update(req, res) {
    try {
      const {
        nome,
        nuit,
        endereco,
        cidade,
        provincia,
        codigo_postal,
        telefone,
        email,
        website,
        regime_iva,
        atividade_principal,
        capital_social,
        moeda_base,
        ano_fiscal
      } = req.body;

      // Aqui seria a lógica para salvar no banco de dados
      console.log('Dados da empresa atualizados:', req.body);

      req.flash('success', 'Dados da empresa atualizados com sucesso!');
      res.redirect('/empresa');
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      req.flash('error', 'Erro ao atualizar dados da empresa');
      res.redirect('/empresa');
    }
  }
}

module.exports = new EmpresaController();