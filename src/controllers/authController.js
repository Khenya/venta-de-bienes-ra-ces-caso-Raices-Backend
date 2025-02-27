const { authenticateUser } = require('../services/authService');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authenticateUser(username, password);
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { login };