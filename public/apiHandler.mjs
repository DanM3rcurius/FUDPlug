import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import cors from 'cors'; 
// Environment Variables (dotenv)
const MAGICK_API_KEY = process.env.MAGICK_API_KEY; 
const MAGICK_AGENT_ID = process.env.MAGICK_AGENT_ID; 
const MAGICK_API_URL = process.env.MAGICK_API_URL; 

// create http server
const server = http.createServer((req, res) => {
  // Enable CORS for all routes
  cors()(req, res, () => {
    if (req.method === 'GET') {
      interactWithChatbot(); // Handle GET requests for retrieving chatbot responses
    } else if (req.method === 'POST') {
      handlePostRequest(req, res);
    } else {
      res.writeHead(501, { 'Content-Type': 'text/plain' });
      res.end('Unsupported method');
    }
  });
});

function handlePostRequest(req, res) {
  if (req.url === '/api') {
    processApiRequest(req, res);
  } else {
    res.writeHead(501, { 'Content-Type': 'text/plain' });
    res.end('Unsupported method');
  }
}

function processApiRequest(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    console.log('POST body:', body);

    try {
      const jsonBody = JSON.parse(body);
      const chatMessage = jsonBody.content;

      interactWithChatbot(chatMessage)
        .then(apiResponse => {
          // Set CORS headers explicitly
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Allow requests from any origin
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          });
          res.end(JSON.stringify({ message: apiResponse }));
        })
        .catch(error => {
          console.error('Error processing API request:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');
    }
  });
}

function interactWithChatbot(chatMessage) {
  const apiUrl = `${process.env.MAGICK_API_URL}/${process.env.MAGICK_AGENT_ID}?apiKey=${process.env.MAGICK_API_KEY}`;

  const requestBody = {
    id: process.env.MAGICK_AGENT_ID,
    apiKey: process.env.MAGICK_API_KEY,
    content: chatMessage
  };

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(data => data.message)
    .catch(error => {
      console.error('Error interacting with chatbot:', error);
      throw error;
    });
}

export { processApiRequest, interactWithChatbot };
