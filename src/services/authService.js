const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authenticateUser = async (username, password) => {
  console.log('Buscando usuario:', username);

  const user = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username]);


  console.log('Resultado de la consulta:', user.rows); 

  if (user.rows.length === 0) {
    console.log('Usuario no encontrado en la base de datos');
    throw new Error('Tenant or user not found');
  }

  console.log('Usuario encontrado:', user.rows[0]);

  const storedHashedPassword = user.rows[0].password;
  console.log('Contraseña en BD:', storedHashedPassword);

  const validPassword = await bcrypt.compare(password, storedHashedPassword);
  console.log('¿Contraseña válida?:', validPassword);

  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.rows[0].id, role: user.rows[0].role },
    process.env.JWT_SECRET,
    { expiresIn: '4h' }
  );

  console.log('Token generado:', token);
  return token;
};

module.exports = { authenticateUser };