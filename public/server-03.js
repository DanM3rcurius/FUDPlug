const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const chatSessions = {};

require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json()); // Parse JSON bodies

// CORS Middleware (if needed)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Endpoint for session ID
app.get('/api/session-id', (req, res) => {
    res.json({ sessionId: uuidv4() });
});

// Endpoint to handle chat messages
app.post('/api/chat', async (req, res) => {
    const { prompt, sessionId } = req.body;
    // Initialize session if it doesn't exist
    if (!chatSessions[sessionId]) {
        chatSessions[sessionId] = [];
    }

    chatSessions[sessionId].push({
        message: sanitizeMessage(prompt),
        timestamp: new Date()
    });
    
    try {
        const apiUrl = `${process.env.MAGICK_API_URL}/api`;
        console.log('Making request to:', apiUrl); // Log the API URL

        const response = await axios.post(apiUrl, {
            agentId: process.env.MAGICK_AGENT_ID,
            content: prompt,
            client: "cloud",
            sessionId: sessionId,
            sender: "user",
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.MAGICK_API_KEY,
            }
        });

        if (response.headers['content-type'].includes('application/json')) {
            res.json(response.data);
        } else {
            console.error('Unexpected response type:', response.headers['content-type']);
            res.status(500).send('Internal Server Error - Unexpected response type');
        }
    } catch (error) {
        console.error('Error processing API request:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Sanitization
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

function sanitizeMessage(message) {
    return DOMPurify.sanitize(message);
}


// Chat export feature
app.get('/api/export/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const chatHistory = chatSessions[sessionId] || [];

    // Convert chat history to a downloadable format, e.g., JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=chat_history.json');
    res.send(JSON.stringify(chatHistory, null, 2));
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
