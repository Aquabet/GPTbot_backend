const { v4: uuidv4 } = require('uuid');

// Static demo sessions for the demo user
let demoSessions = [
    { sessionId: 'demo-session-1', sessionName: 'Demo Session 1', messages: [] },
    { sessionId: 'demo-session-2', sessionName: 'Demo Session 2', messages: [] },
];

// Create a new session for the demo user
exports.createSession = (req, res) => {
    const sessionId = uuidv4();
    const sessionName = `Session ${demoSessions.length + 1}`;

    demoSessions.push({ sessionId, sessionName, messages: [] });
    res.status(201).json({ sessionId, sessionName });
};

// Retrieve all sessions for the demo user
exports.getSessions = (req, res) => {
    res.json(demoSessions.map(({ sessionId, sessionName }) => ({ sessionId, sessionName })));
};

// Retrieve chat history for a specific demo session
exports.getChatHistory = (req, res) => {
    const { sessionId } = req.params;

    const session = demoSessions.find((s) => s.sessionId === sessionId);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session.messages);
};

// Delete a specific demo session
exports.deleteSession = (req, res) => {
    const { sessionId } = req.params;

    const sessionIndex = demoSessions.findIndex((s) => s.sessionId === sessionId);
    if (sessionIndex === -1) {
        return res.status(404).json({ error: 'Session not found' });
    }

    demoSessions.splice(sessionIndex, 1);
    res.status(200).json({ message: 'Session deleted successfully' });
};

// Rename a specific demo session
exports.renameSession = (req, res) => {
    const { sessionId } = req.params;
    const { newName } = req.body;

    if (!newName || newName.trim() === '') {
        return res.status(400).json({ error: 'New session name cannot be empty' });
    }

    const session = demoSessions.find((s) => s.sessionId === sessionId);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    if (demoSessions.some((s) => s.sessionName === newName.trim())) {
        return res.status(400).json({ error: 'Session with the same name already exists' });
    }

    session.sessionName = newName.trim();
    res.status(200).json({ message: 'Session renamed successfully' });
};

// Send a message in a specific demo session
exports.sendMessage = (req, res) => {
    const { sessionId, content } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    const session = demoSessions.find((s) => s.sessionId === sessionId);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    const message = { role: 'user', content };
    session.messages.push(message);

    const assistantMessage = {
        role: 'assistant',
        content: 'Demo mode does not support API calls.',
    };
    session.messages.push(assistantMessage);

    res.json(assistantMessage);
};
