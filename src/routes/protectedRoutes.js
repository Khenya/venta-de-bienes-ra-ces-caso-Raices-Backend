const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); 
const checkPermission = require('../middleware/checkPermission'); 

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Perfil del usuario', user: req.user });
});

router.get('/admin', authenticateToken, checkPermission('edit_inmuebles'), (req, res) => {
  res.json({ message: 'Acceso concedido: Eres un administrador.' });
});

router.get('/dueño', authenticateToken, checkPermission('view_inmuebles'), (req, res) => {
  res.json({ message: 'Acceso concedido: Eres un dueño.' });
});

module.exports = router;