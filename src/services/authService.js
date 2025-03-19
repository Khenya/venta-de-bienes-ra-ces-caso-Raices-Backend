const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authenticateUser = async (username, password) => {
  try {
    const query = `
      SELECT users.user_id, users.password, role.name AS role
      FROM users
      JOIN role ON users.rol_id = role.role_id
      WHERE LOWER(users.username) = LOWER($1)
    `;

    const user = await pool.query(query, [username]);

    if (user.rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const storedHashedPassword = user.rows[0].password;
    const validPassword = await bcrypt.compare(password, storedHashedPassword);

    if (!validPassword) {
      throw new Error('Credenciales inválidas');
    }
    const token = jwt.sign(
      { userId: user.rows[0].user_id, role: user.rows[0].role }, 
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );
    return token;
  } catch (error) {
    console.error("Error en la autenticación:", error.message);
    throw error;
  }
};

module.exports = { authenticateUser };
