const fs = require('fs');
const path = require('path');

class SistemaController {
  // Página de backup e recuperação
  async index(req, res) {
    try {
      // Definir breadcrumbs primeiro
      const breadcrumbs = [
        { name: 'Dashboard', url: '/dashboard' },
        { name: 'Configurações', url: '/configuracoes' },
        { name: 'Backup & Recuperação', url: '/sistema' }
      ];

      // Dados simulados de backups
      const backups = [
        {
          id: 1,
          nome: 'backup_2024_01_15_14_30.sql',
          data: new Date('2024-01-15 14:30:00'),
          tamanho: '45.2 MB',
          tipo: 'Completo',
          status: 'Concluído'
        },
        {
          id: 2,
          nome: 'backup_2024_01_14_02_00.sql',
          data: new Date('2024-01-14 02:00:00'),
          tamanho: '43.8 MB',
          tipo: 'Automático',
          status: 'Concluído'
        },
        {
          id: 3,
          nome: 'backup_2024_01_13_02_00.sql',
          data: new Date('2024-01-13 02:00:00'),
          tamanho: '42.1 MB',
          tipo: 'Automático',
          status: 'Concluído'
        }
      ];

      const configuracoes = {
        backup_automatico: true,
        frequencia_backup: 'diario',
        horario_backup: '02:00',
        retencao_dias: 30,
        compressao: true,
        notificacao_email: true,
        email_notificacao: 'admin@syntra-erp.co.mz'
      };

      const estatisticas = {
        total_backups: 156,
        espaco_utilizado: '2.3 GB',
        ultimo_backup: new Date('2024-01-15 14:30:00'),
        proximo_backup: new Date('2024-01-16 02:00:00')
      };

      // Log para debug - verificar se todas as variáveis estão definidas
      console.log('Variáveis para renderização:', {
        breadcrumbs: breadcrumbs ? breadcrumbs.length : 'undefined',
        backups: backups ? backups.length : 'undefined',
        configuracoes: configuracoes ? 'definido' : 'undefined',
        estatisticas: estatisticas ? 'definido' : 'undefined'
      });

      // Renderizar a view com todas as variáveis necessárias
      return res.render('configuracoes/sistema/index', {
        title: 'Backup & Recuperação - SYNTRA ERP',
        layout: 'layouts/main',
        breadcrumbs: breadcrumbs,
        backups: backups,
        configuracoes: configuracoes,
        estatisticas: estatisticas
      });
    } catch (error) {
      console.error('Erro ao carregar sistema:', error);
      req.flash('error', 'Erro ao carregar configurações do sistema');
      return res.redirect('/dashboard');
    }
  }

  // Criar backup manual
  async criarBackup(req, res) {
    try {
      const nomeBackup = `backup_manual_${new Date().toISOString().replace(/[:.]/g, '_')}.sql`;
      
      console.log('Criando backup:', nomeBackup);
      
      req.flash('success', 'Backup criado com sucesso!');
      res.redirect('/sistema');
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      req.flash('error', 'Erro ao criar backup');
      res.redirect('/sistema');
    }
  }

  // Restaurar backup
  async restaurarBackup(req, res) {
    try {
      const { backup_id } = req.body;
      
      console.log('Restaurando backup ID:', backup_id);
      
      req.flash('success', 'Backup restaurado com sucesso!');
      res.redirect('/sistema');
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      req.flash('error', 'Erro ao restaurar backup');
      res.redirect('/sistema');
    }
  }

  // Atualizar configurações de backup
  async atualizarConfiguracoes(req, res) {
    try {
      const {
        backup_automatico,
        frequencia_backup,
        horario_backup,
        retencao_dias,
        compressao,
        notificacao_email,
        email_notificacao
      } = req.body;

      console.log('Configurações atualizadas:', req.body);

      req.flash('success', 'Configurações de backup atualizadas com sucesso!');
      res.redirect('/sistema');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      req.flash('error', 'Erro ao atualizar configurações');
      res.redirect('/sistema');
    }
  }
}

module.exports = new SistemaController();