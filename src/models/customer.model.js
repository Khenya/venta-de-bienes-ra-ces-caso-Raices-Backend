const pool = require('../config/db');

const create = async (customerData) => {
  const query = `
    INSERT INTO customer (ci, name, phone) 
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = [customerData.ci, customerData.name, customerData.phone];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const linkToProperty = async (customer_id, property_id) => {
  const query = `
    INSERT INTO notification_customer_property (customer_id, id_inmueble)
    VALUES ($1, $2)
  `;
  await pool.query(query, [customer_id, property_id]);
};

module.exports = {
  create,
  linkToProperty
};