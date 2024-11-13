const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const USERS = require('../config/users');
const config = require('../config/config');

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Special case for Demo user
  if (username === 'demo') {
    if (password !== 'demo') {
      req.failedLoginTracker.increment(); // Increment failed attempts for IP
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Reset failed attempts for IP on successful login
    req.failedLoginTracker.reset();

    const token = jwt.sign({ username: 'demo' }, config.jwtSecret, { expiresIn: '1h' });
    console.log('Demo Token:', token);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ username: 'demo', isDemo: true });
  }

  // Handle other users
  try {
    const user = USERS.find((u) => u.username === username);
    if (!user) {
      req.failedLoginTracker.increment(); // Increment failed attempts for IP
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      req.failedLoginTracker.increment(); // Increment failed attempts for IP
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Reset failed attempts for IP on successful login
    req.failedLoginTracker.reset();

    const token = jwt.sign(
      { username, systemInstructions: user.systemInstructions },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ username: user.username, isDemo: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in.' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: config.environment === 'production',
  });
  res.status(205).json({ message: 'Logged out and session cleared.' });
};
