const pool = require('../config/db');

const Roles = {
  getAll: async () => {
    const res = await pool.query('SELECT * FROM roles');
    return res.rows;
  },

  getById: async (id) => {
    const res = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    return res.rows[0];
  },

  create: async (name, description) => {
    const res = await pool.query(
      'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return res.rows[0];
  },

  update: async (id, name, description) => {
    const res = await pool.query(
      'UPDATE roles SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return res.rows[0];
  },

  delete: async (id) => {
    const res = await pool.query('DELETE FROM roles WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  },
};

module.exports = Roles;