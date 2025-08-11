const User = require('../models/User');
const Cliente = require('../models/Cliente');

// Controlador para o módulo de faturação e cobranças

// Assinaturas Ativas
exports.assinaturas = async (req, res) => {
    try {
        // Aqui virá a lógica para obter dados de assinaturas ativas
        // Por enquanto, apenas renderizamos a página
        
        res.render('faturacao/assinaturas/index', {
            title: 'Assinaturas Ativas',
            breadcrumbs: [
                { texto: 'Dashboard', link: '/dashboard' },
                { texto: 'Faturação & Cobrança', link: '#' },
                { texto: 'Assinaturas Ativas', link: '#' }
            ]
        });
    } catch (error) {
        console.error('Erro ao carregar assinaturas:', error);
        req.flash('error', 'Erro ao carregar assinaturas ativas');
        res.redirect('/dashboard');
    }
};

// Faturas Emitidas
exports.faturas = async (req, res) => {
    try {
        // Aqui virá a lógica para obter dados de faturas emitidas
        // Por enquanto, apenas renderizamos a página
        
        res.render('faturacao/faturas/index', {
            title: 'Faturas Emitidas',
            breadcrumbs: [
                { texto: 'Dashboard', link: '/dashboard' },
                { texto: 'Faturação & Cobrança', link: '#' },
                { texto: 'Faturas Emitidas', link: '#' }
            ]
        });
    } catch (error) {
        console.error('Erro ao carregar faturas:', error);
        req.flash('error', 'Erro ao carregar faturas emitidas');
        res.redirect('/dashboard');
    }
};

// Controlo de Pagamentos
exports.pagamentos = async (req, res) => {
    try {
        // Aqui virá a lógica para obter dados de controlo de pagamentos
        // Por enquanto, apenas renderizamos a página
        
        res.render('faturacao/pagamentos/index', {
            title: 'Controlo de Pagamentos',
            breadcrumbs: [
                { texto: 'Dashboard', link: '/dashboard' },
                { texto: 'Faturação & Cobrança', link: '#' },
                { texto: 'Controlo de Pagamentos', link: '#' }
            ]
        });
    } catch (error) {
        console.error('Erro ao carregar pagamentos:', error);
        req.flash('error', 'Erro ao carregar controlo de pagamentos');
        res.redirect('/dashboard');
    }
};

// Gestão de Planos
exports.planos = async (req, res) => {
    try {
        // Aqui virá a lógica para obter dados de gestão de planos
        // Por enquanto, apenas renderizamos a página
        
        res.render('faturacao/planos/index', {
            title: 'Gestão de Planos',
            breadcrumbs: [
                { texto: 'Dashboard', link: '/dashboard' },
                { texto: 'Faturação & Cobrança', link: '#' },
                { texto: 'Gestão de Planos', link: '#' }
            ]
        });
    } catch (error) {
        console.error('Erro ao carregar planos:', error);
        req.flash('error', 'Erro ao carregar gestão de planos');
        res.redirect('/dashboard');
    }
};