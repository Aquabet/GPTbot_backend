const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.authToken;

  if (!token || typeof token !== 'string' || token.trim() === '') {
    return res.status(401).json({ error: 'Authentication token is missing or invalid' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    if (user.username === 'demo') {
      req.user = { username: 'demo' };
      return next();
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
