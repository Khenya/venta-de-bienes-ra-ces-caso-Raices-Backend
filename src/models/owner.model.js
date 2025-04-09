const pool = require('../config/db');

const findByName = async (name) => {
  const query = 'SELECT * FROM owner WHERE name = $1';
  const { rows } = await pool.query(query, [name]);
  return rows[0];
};

const linkToProperty = async (owner_id, property_id) => {
  const query = 'INSERT INTO owner_property (owner_id, property_id) VALUES ($1, $2)';
  await pool.query(query, [owner_id, property_id]);
};

module.exports = {
  findByName,
  linkToProperty
};
