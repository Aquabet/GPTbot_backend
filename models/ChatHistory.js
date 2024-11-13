const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: { type: String, required: true },
    content: { type: String, required: true },
});

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    sessionName: { type: String, required: true },
    messages: [messageSchema],
});

const chatHistorySchema = new mongoose.Schema({
    username: { type: String, required: true },
    sessions: [sessionSchema],
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
