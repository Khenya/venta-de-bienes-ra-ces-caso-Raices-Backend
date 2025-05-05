const bcrypt = require('bcrypt');
const pool = require('../config/db');
const hashPassword = require('../utils/hashPassword')

const Users = {
  getAll: async () => {
    const res = await pool.query('SELECT * FROM users');
    return res.rows;
  },

  getById: async (id) => {
    const res = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    return res.rows[0];
  },

  update: async (id, username, password, rol_id) => {
    const res = await pool.query(
      'UPDATE users SET username = $1, password = $2, rol_id = $3 WHERE user_id  = $4 RETURNING *',
      [username, password, rol_id, id]
    );
    return res.rows[0];
  }, 
  
  updatePassword: async (id, newPassword) => {
    try {
      const hashedPassword = await hashPassword(newPassword);

      const res = await pool.query(
        'UPDATE users SET password = $1 WHERE user_id  = $2 RETURNING *',
        [hashedPassword, id]
      );

      return res.rows[0];
    } catch (err) {
      throw new Error('Error al actualizar la contraseña: ' + err.message);
    }
  },

  create: async ({ username, password, role_id }) => {
    try {
      const hashedPassword = await hashPassword(password);
  
      const res = await pool.query(
        'INSERT INTO users (username, password, rol_id) VALUES ($1, $2, $3) RETURNING *;',
        [username, hashedPassword, role_id]
      );
  
      return res.rows[0];
    } catch (err) {
      throw new Error('Error al crear usuario: ' + err.message);
    }
  },
  
  delete: async (id) => {
    try {
      const res = await pool.query(
        'DELETE FROM users WHERE user_id = $1 RETURNING *;',
        [id]
      );
  
      return res.rows[0];
    } catch (err) {
      throw new Error('Error al eliminar usuario: ' + err.message);
    }
  }  
};

module.exports = Users;