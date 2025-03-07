const pool = require('../db/db');

const Permissions = {
  getAll: async () => {
    const res = await pool.query('SELECT * FROM permissions');
    return res.rows;
  },

  getById: async (id) => {
    const res = await pool.query('SELECT * FROM permissions WHERE id = $1', [id]);
    return res.rows[0];
  },

  create: async (name) => {
    const res = await pool.query(
      'INSERT INTO permissions (name) VALUES ($1) RETURNING *',
      [name]
    );
    return res.rows[0];
  },

  update: async (id, name) => {
    const res = await pool.query(
      'UPDATE permissions SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return res.rows[0];
  },

  delete: async (id) => {
    const res = await pool.query('DELETE FROM permissions WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  },
};

module.exports = Permissions;