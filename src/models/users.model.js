const bcrypt = require('bcrypt');
const pool = require('../db/db');
const hashPassword = require('../middleware/hashPassword')

const Users = {
  getAll: async () => {
    const res = await pool.query('SELECT * FROM users');
    return res.rows;
  },

  getById: async (id) => {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0];
  },

  update: async (id, username, password, rol_id) => {
    const res = await pool.query(
      'UPDATE users SET username = $1, password = $2, rol_id = $3 WHERE id = $4 RETURNING *',
      [username, password, rol_id, id]
    );
    return res.rows[0];
  }, 
  
  updatePassword: async (id, newPassword) => {
    try {
      const hashedPassword = await hashPassword(newPassword);

      const res = await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2 RETURNING *',
        [hashedPassword, id]
      );

      return res.rows[0];
    } catch (err) {
      throw new Error('Error al actualizar la contraseña: ' + err.message);
    }
  }

};

module.exports = Users;