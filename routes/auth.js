const express = require('express');
const { login, logout } = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/validate', authenticateToken, (req, res) => {
    res.sendStatus(200);
});


module.exports = router;
