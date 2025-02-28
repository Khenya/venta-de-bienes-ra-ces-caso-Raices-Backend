const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authenticateUser = async (username, password) => {
  const user = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username]);
 
  if (user.rows.length === 0) {
    throw new Error('Tenant or user not found');
  }
  const storedHashedPassword = user.rows[0].password;

  const validPassword = await bcrypt.compare(password, storedHashedPassword);

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