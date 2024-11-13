const ChatHistory = require('../models/ChatHistory');
const { v4: uuidv4 } = require('uuid');

// Create a new session for a user
exports.createSession = async (req, res) => {
    const username = req.user.username;

    try {
        let userHistory = await ChatHistory.findOne({ username });
        let sessionCount = 1; // Default count

        if (userHistory) {
            sessionCount = userHistory.sessions.length + 1; // Increment based on existing sessions
        } else {
            userHistory = new ChatHistory({ username, sessions: [] });
        }

        const sessionId = uuidv4();
        const sessionName = `Session ${sessionCount}`;

        userHistory.sessions.push({ sessionId, sessionName, messages: [] });

        await userHistory.save();
        res.status(201).json({ sessionId, sessionName });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create session' });
    }
};

// Retrieve all sessions for a user
exports.getSessions = async (req, res) => {
    const username = req.user.username;

    try {
        const userHistory = await ChatHistory.findOne({ username });
        const sessions = userHistory
            ? userHistory.sessions.map(({ sessionId, sessionName }) => ({ sessionId, sessionName }))
            : [];
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
};

// Retrieve chat history for a specific session
exports.getChatHistory = async (req, res) => {
    const username = req.user.username;
    const { sessionId } = req.params;

    try {
        const userHistory = await ChatHistory.findOne({ username });
        const session = userHistory?.sessions.find((s) => s.sessionId === sessionId);

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json(session.messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};

// Delete a specific session for a user
exports.deleteSession = async (req, res) => {
    const username = req.user.username;
    const { sessionId } = req.params;

    try {
        const userHistory = await ChatHistory.findOne({ username });

        if (!userHistory || !userHistory.sessions.some((s) => s.sessionId === sessionId)) {
            return res.status(404).json({ error: "Session not found" });
        }

        userHistory.sessions = userHistory.sessions.filter((s) => s.sessionId !== sessionId);
        await userHistory.save();
        res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete session" });
    }
};

// Save updated chat history to a specific session (used as helper)
exports.saveChatHistory = async (username, sessionId, messages) => {
    try {
        const userHistory = await ChatHistory.findOne({ username });
        const session = userHistory?.sessions.find((s) => s.sessionId === sessionId);

        if (!session) {
            return { success: false, message: "Session not found" };
        }

        session.messages = messages;
        await userHistory.save();
        return { success: true, message: "Chat history saved successfully" };
    } catch (error) {
        return { success: false, message: "Failed to save chat history" };
    }
};

// Retrieve all messages in a specific session (used as helper)
exports.getSessionMessages = async (username, sessionId) => {
    try {
        const userHistory = await ChatHistory.findOne({ username });

        if (!userHistory) {
            return [];
        }

        const session = userHistory.sessions.find((s) => s.sessionId === sessionId);
        if (!session) {
            return [];
        }

        return session.messages;
    } catch (error) {
        return [];
    }
};

// Rename a specific session for a user
exports.renameSession = async (req, res) => {
    const username = req.user.username;
    const { sessionId } = req.params;
    const { newName } = req.body;

    if (!newName || newName.trim() === "") {
        return res.status(400).json({ error: "New session name cannot be empty" });
    }

    try {
        const userHistory = await ChatHistory.findOne({ username });
        if (!userHistory) {
            return res.status(404).json({ error: "User history not found" });
        }

        const session = userHistory.sessions.find((s) => s.sessionId === sessionId);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        if (userHistory.sessions.some((s) => s.sessionName === newName.trim())) {
            return res.status(400).json({ error: "Session with the same name already exists" });
        }

        session.sessionName = newName.trim();
        await userHistory.save();
        res.status(200).json({ message: "Session renamed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to rename session" });
    }
};
