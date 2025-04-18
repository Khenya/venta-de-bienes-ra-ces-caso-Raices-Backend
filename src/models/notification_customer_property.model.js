const pool = require('../config/db');

const linkPropertyToNotification = async (property_id, notification_id) => {
  const query = `
    INSERT INTO notification_customer_property (property_id, notification_id)
    VALUES ($1, $2)
  `;
  await pool.query(query, [property_id, notification_id]);
};

module.exports = {
  linkPropertyToNotification
};