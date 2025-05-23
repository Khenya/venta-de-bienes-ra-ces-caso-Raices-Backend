const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); 
const checkPermission = require('../middleware/checkPermission'); 
const {
  getAllPropertiesHandler,
  getPropertyByIdHandler,
  getFilteredPropertiesHandler,
  createOrUpdateProperty,
  updatePropertyState, 
  createObservationHandler,
  getObservationsByPropertyId,
  getPropertyCountByStates,
  getPropertyCountsHandler,
  getPropertyCountByOwnerHandler
} = require('../controllers/propertyController');

const { createCustomer } = require('../controllers/customerController');
const {
  createNotification,
  getNotificationsForUser,
  deleteNotificationForUser,
  eventsHandler
} = require('../controllers/notificationController');

// Perfil y roles
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Perfil del usuario', user: req.user });
});
router.get('/admin', authenticateToken, checkPermission('edit_property'), (req, res) => {
  res.json({ message: 'Acceso concedido: Eres un administrador.' });
});
router.get('/owner', authenticateToken, checkPermission('see_property'), (req, res) => {
  res.json({ message: 'Acceso concedido: Eres un dueño.' });
});

// Propiedades
router.get('/properties/filter', authenticateToken, getFilteredPropertiesHandler); 
router.get('/properties', authenticateToken, getAllPropertiesHandler);
router.get('/properties/:id', authenticateToken, getPropertyByIdHandler);

router.post('/property', authenticateToken, createOrUpdateProperty);
router.put('/property/:id', authenticateToken, createOrUpdateProperty);
router.patch('/property/:id/state', authenticateToken, updatePropertyState);

// Estadísticas
router.get('/property-stats', authenticateToken, getPropertyCountByStates);
router.get('/property-counts', authenticateToken, getPropertyCountsHandler);
router.get('/property-by-owner', authenticateToken, getPropertyCountByOwnerHandler);

// Observaciones
router.post('/observation', authenticateToken, createObservationHandler);
router.get('/properties/:id/observations', getObservationsByPropertyId);

// Clientes
router.post('/customer', authenticateToken, createCustomer);

// Notificaciones
router.post('/notification', authenticateToken, createNotification);
router.get('/notifications', authenticateToken, getNotificationsForUser);
router.delete('/notifications/:id', authenticateToken, deleteNotificationForUser);
router.get('/notifications/stream', eventsHandler);

module.exports = router;