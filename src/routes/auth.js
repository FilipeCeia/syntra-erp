// ====================================
// src/routes/auth.js ATUALIZADA
// ====================================
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

module.exports = router;