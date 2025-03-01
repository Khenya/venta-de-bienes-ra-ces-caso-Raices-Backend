const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../utils/blacklist');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt; 

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  if (isTokenBlacklisted(token)) {
    return res.status(403).json({ error: 'Token has been invalidated.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
