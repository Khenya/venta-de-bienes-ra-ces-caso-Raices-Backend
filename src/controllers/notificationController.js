const Notification = require('../models/notification.model');
const NotificationCustomerProperty = require('../models/notification_customer_property.model');
const Property = require('../models/propertyModel');

const createNotification = async (req, res) => {
  try {
    const { property_id, state } = req.body;

    if (!property_id || !state) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const property = await Property.getPropertyById(property_id);
    if (!property) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    const notification = await Notification.create({
      property_id,
      manzano: property.manzano,
      batch: property.batch,
      state
    });

    await NotificationCustomerProperty.linkPropertyToNotification(
      property_id,
      notification.notification_id
    );

    res.status(201).json({ message: "Notificación creada", notification });
  } catch (error) {
    console.error("Error al crear notificación:", error.message);
    res.status(500).json({ message: "Error al crear notificación" });
  }
};

module.exports = { createNotification };