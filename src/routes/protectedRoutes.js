const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); 
const checkPermission = require('../middleware/checkPermission'); 
const {
  getAllPropertiesHandler,
  getPropertiesByUserHandler,
  getPropertyByIdHandler,
  getPropertyByStateHandler,
  getPropertyByPriceHandler,
  getPropertyByManzanoHandler, 
  getPropertyByBatchHandler
} = require('../controllers/propertyController');

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Perfil del usuario', user: req.user });
});

router.get('/admin', authenticateToken, checkPermission('edit_property'), (req, res) => {
  res.json({ message: 'Acceso concedido: Eres un administrador.' });
});

router.get('/owner', authenticateToken, checkPermission('see_property'), (req, res) => {
  res.json({ message: 'Acceso concedido: Eres un dueño.' });
});

router.get('/properties', verificarToken, getAllPropertiesHandler);

router.get('/my-properties', verificarToken, getPropertiesByUserHandler);

router.get('/properties/:id', verificarToken, getPropertyByIdHandler);

router.get('/properties/state/:state', verificarToken, getPropertyByStateHandler);

router.get('/properties/price/:price', verificarToken, getPropertyByPriceHandler);

router.get('/properties/manzano/:manzano', verificarToken, getPropertyByManzanoHandler);

router.get('/properties/batch/:batch', verificarToken, getPropertyByBatchHandler);

module.exports = router;