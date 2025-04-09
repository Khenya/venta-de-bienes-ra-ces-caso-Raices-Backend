const pool = require('../config/db');

const create = async ({ owner_id, property_id }) => {
  const query = `
    INSERT INTO owner_property (owner_id, property_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [owner_id, property_id]);
  return rows[0];
};

module.exports = { create };
