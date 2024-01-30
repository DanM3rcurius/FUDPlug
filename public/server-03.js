const express = require('express');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files
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
    try {
        const response = await fetch(`${process.env.MAGICK_API_URL}/api`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.MAGICK_API_KEY,
            },
            body: JSON.stringify({
                agentId: process.env.MAGICK_AGENT_ID,
                content: prompt,
                client: "cloud",
                sessionId: sessionId,
                sender: "user", // Update this if you have specific sender IDs
            }),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error processing API request:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
