const axios = require('axios');
const config = require('../config/config');
const chatHistoryController = require('./chatHistoryController');

// Handle the message exchange with GPT-4 and save the session history
exports.fetchGptResponse = async (req, res) => {
    const username = req.user.username;
    const { content, sessionId } = req.body;

    try {
        // 1. Fetch existing chat history for the specified session
        const messages = await chatHistoryController.getSessionMessages(username, sessionId);
        messages.push({ role: 'user', content });

        // 2. Send the chat history to GPT-4 API along with the new message
        const systemInstructions = req.user.systemInstructions;
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4-turbo',
                messages: [
                    { role: 'system', content: systemInstructions },
                    ...messages,
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${config.openaiApiKey}`,
                },
            }
        );

        // 3. Prepare assistant's message based on the GPT-4 response
        const assistantMessage = {
            role: 'assistant',
            content: response.data.choices[0].message.content,
        };
        messages.push(assistantMessage);

        // 4. Save the updated chat history for the session
        await chatHistoryController.saveChatHistory(username, sessionId, messages);

        res.json(assistantMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch response from GPT API' });
    }
};
