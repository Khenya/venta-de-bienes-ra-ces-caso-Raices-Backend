const pool = require('../config/db');

const create = async ({ property_id, manzano, batch, state }) => {
  const query = `
    INSERT INTO notification (property_id, manzano, batch, state, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *;
  `;
  const values = [property_id, manzano, batch, state];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  create
};
