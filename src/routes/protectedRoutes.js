const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); 
const checkPermission = require('../middleware/checkPermission'); 
const {
  getAllPropertiesHandler,
  getPropertyByIdHandler,
  getPropertyByStateHandler,
  getPropertyByPriceHandler,
  getPropertyByManzanoHandler, 
  getPropertyByBatchHandler,
  createOrUpdateProperty,
  updatePropertyState, 
  createObservationHandler,
  getObservationsByPropertyId,
  getPropertyCountByStates
} = require('../controllers/propertyController');
const { createCustomer } = require('../controllers/customerController')
const { createNotification, 
  getNotificationsForUser, 
  deleteNotificationForUser,
  eventsHandler 
} = require('../controllers/notificationController')

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Perfil del usuario', user: req.user });
});

router.get('/admin', authenticateToken, checkPermission('edit_property'), (req, res) => {
  res.json({ message: 'Acceso concedido: Eres un administrador.' });
});

router.get('/owner', authenticateToken, checkPermission('see_property'), (req, res) => {
  res.json({ message: 'Acceso concedido: Eres un dueño.' });
});

router.get('/properties', authenticateToken, getAllPropertiesHandler);

router.get('/properties/:id', authenticateToken, getPropertyByIdHandler);

router.get('/properties/state/:state', authenticateToken, getPropertyByStateHandler);

router.get('/properties/price/:price', authenticateToken, getPropertyByPriceHandler);

router.get('/properties/manzano/:manzano', authenticateToken, getPropertyByManzanoHandler);

router.get('/properties/batch/:batch', authenticateToken, getPropertyByBatchHandler);

router.post('/property', authenticateToken, createOrUpdateProperty);

router.put('/property/:id', authenticateToken, createOrUpdateProperty);

router.patch('/property/:id/state', authenticateToken, updatePropertyState);

router.get('/property-stats', authenticateToken, getPropertyCountByStates);

router.post('/customer', authenticateToken, createCustomer);

router.post('/observation', authenticateToken, createObservationHandler);

router.get('/properties/:id/observations', getObservationsByPropertyId);

router.post('/notification', authenticateToken, createNotification);

router.get('/notifications', authenticateToken, getNotificationsForUser);

router.delete('/notifications/:id', authenticateToken, deleteNotificationForUser);

router.post('/notification', authenticateToken, createNotification);

router.get('/notifications/stream', eventsHandler);

module.exports = router;