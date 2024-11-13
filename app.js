const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const authenticateToken = require('./middleware/authenticateToken');

const app = express();

connectDB();

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN_PRODUCTION : process.env.CORS_ORIGIN_DEVELOP,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Internal server error, please try again later or contact administrator' });
});

module.exports = app;
