const Notification = require('../models/notification.model');
const NotificationCustomerProperty = require('../models/notification_customer_property.model');
const Property = require('../models/propertyModel');
const pool = require('../config/db');
const { addClient, removeClient } = require('../utils/sseManager');

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

    clients.forEach(client => {
      client.res.write(`data: ${JSON.stringify({
        type: "NEW_NOTIFICATION",
        payload: notification
      })}\n\n`);
    });

    res.status(201).json({ message: "Notificación creada", notification });
  } catch (error) {
    console.error("Error al crear notificación:", error.message);
    res.status(500).json({ message: "Error al crear notificación" });
  }
};

const getNotificationsForUser = async (req, res) => {
  try {
    const { userId } = req.user;

    console.log("Usuario autenticado:", req.user);

    const query = `
      SELECT n.*
      FROM notification n
      JOIN user_notifications un ON n.notification_id = un.notification_id
      WHERE un.user_id = $1
      ORDER BY n.created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error.message);
    res.status(500).json({ message: "No se pudieron obtener las notificaciones" });
  }
};

const deleteNotificationForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await pool.query(
      `DELETE FROM user_notifications WHERE user_id = $1 AND notification_id = $2`,
      [userId, id]
    );

    res.status(200).json({ message: "Notificación eliminada para el usuario" });
  } catch (error) {
    console.error("Error al eliminar notificación:", error.message);
    res.status(500).json({ message: "Error al eliminar notificación" });
  }
};

const eventsHandler = (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*"
  });
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  addClient(newClient);

  req.on("close", () => {
    removeClient(clientId);
  });
};

module.exports = { createNotification, getNotificationsForUser, deleteNotificationForUser, eventsHandler };