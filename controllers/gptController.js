const OpenAI = require('openai');
const config = require('../config/config');
const chatHistoryController = require('./chatHistoryController');

const openai = new OpenAI({
    apiKey: config.openaiApiKey
});
const deepseek = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: config.deepseekApiKey
});

// Handle the message exchange with GPT-4 and save the session history
exports.fetchGptResponse = async (req, res) => {
    const username = req.user.username;
    const { content, sessionId, modelProvider = 'openai', modelName = 'gpt-4-turbo' } = req.body;

    try {
        // 1. Fetch existing chat history for the specified session
        const messages = await chatHistoryController.getSessionMessages(username, sessionId);
        messages.push({ role: 'user', content });

        // 2. Set system instructions
        // TODO: Implement a way to set system instructions
        const systemInstructions = req.user.systemInstructions;
        const fullMessages = [
            { role: "system", content: systemInstructions },
            ...messages,
        ];

        let response;

        if (modelProvider === "openai") {
            response = await openai.chat.completions.create({
                model: modelName,
                messages: fullMessages,
            });
        } else if (modelProvider === "deepseek") {
            response = await deepseek.chat.completions.create({
                model: modelName,
                messages: fullMessages,
            });
        } else {
            throw new Error("Invalid model provider");
        }

        // 4. Prepare assistant's message from OpenAI response
        const assistantMessage = {
            role: "assistant",
            content: response.choices[0].message.content,
        };
        messages.push(assistantMessage);

        // 5. Save updated chat history
        await chatHistoryController.saveChatHistory(username, sessionId, messages);

        res.json(assistantMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch response from GPT API' });
    }
};
