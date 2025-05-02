const { authenticateUser } = require('../services/authService');
const { addToBlacklist } = require('../utils/blacklist');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authenticateUser(username, password);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 4 * 60 * 60 * 1000
    });

    res.status(200).json({ 
      message: 'Login successful', 
      token 
    });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    addToBlacklist(token);
    
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during logout' });
  }
};

module.exports = { login, logout };