const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
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
    try {
        const response = await axios.post(`${process.env.MAGICK_API_URL}/api`, {
            agentId: process.env.MAGICK_AGENT_ID,
            content: prompt,
            client: "FUDPLUG_localhost",
            sessionId: sessionId,
            sender: "user", // Update as needed
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.MAGICK_API_KEY,
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error processing API request:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
