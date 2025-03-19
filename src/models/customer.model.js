const pool = require('../config/db');

const create = async (customerData) => {
  const query = `
    INSERT INTO customer (ci, name, phone) 
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = Object.values(customerData);
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { create };
