const express = require('express');
const {
    getChatHistory,
    createSession,
    getSessions,
    deleteSession,
    renameSession,
} = require('../controllers/chatHistoryController');
const { fetchGptResponse } = require('../controllers/gptController');
const demoModeController = require('../controllers/demoModeController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Helper function to check if the user is in demo mode
const isDemoUser = (req) => req.user?.username === 'demo';

router.get('/sessions', authenticateToken, (req, res) => {
    if (isDemoUser(req)) {
        return demoModeController.getSessions(req, res);
    }
    return getSessions(req, res);
});

router.post('/session', authenticateToken, (req, res) => {
    if (isDemoUser(req)) {
        return demoModeController.createSession(req, res);
    }
    return createSession(req, res);
});

router.get('/history/:sessionId', authenticateToken, (req, res) => {
    if (isDemoUser(req)) {
        return demoModeController.getChatHistory(req, res);
    }
    return getChatHistory(req, res);
});

router.delete('/session/:sessionId', authenticateToken, (req, res) => {
    if (isDemoUser(req)) {
        return demoModeController.deleteSession(req, res);
    }
    return deleteSession(req, res);
});

router.post('/message', authenticateToken, (req, res) => {
    if (isDemoUser(req)) {
        return demoModeController.sendMessage(req, res);
    }
    return fetchGptResponse(req, res);
});

router.patch('/session/:sessionId', authenticateToken, (req, res) => {
    if (isDemoUser(req)) {
        return demoModeController.renameSession(req, res);
    }
    return renameSession(req, res);
});

module.exports = router;
