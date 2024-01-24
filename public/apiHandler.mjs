import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import cors from 'cors'; 

// Environment variables
const MAGICK_API_KEY = process.env.MAGICK_API_KEY; 
const MAGICK_AGENT_ID = process.env.MAGICK_AGENT_ID; 
const MAGICK_API_URL = process.env.MAGICK_API_URL; 

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Enable CORS for all routes
  cors()(req, res, () => {
    // Check HTTP method
    if (req.method === 'GET') {
      interactWithChatbot(); // Handle GET requests for retrieving chatbot responses
    } else if (req.method === 'POST') {
      handlePostRequest(req, res); // Handle POST requests for API interactions (sending inquiries)
    } else {
      res.writeHead(501, { 'Content-Type': 'text/plain' });
      res.end('Unsupported method');
    } 
  });
});

// Interact with the chatbot by sending a message through a POST request
function handlePostRequest(req, res) {
  // Check if the URL is '/api'
  if (req.url === '/api') {
    processApiRequest(req, res);
  } else {
    // Return 501 if unsupported method
    res.writeHead(501, { 'Content-Type': 'text/plain' });
    res.end('Unsupported method');
  }
}

// Process API requests
function processApiRequest(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    console.log('POST body:', body);

    try {
      // Parse JSON body
      const jsonBody = JSON.parse(body);
      const chatMessage = jsonBody.content;

      // Interact with the chatbot
      interactWithChatbot(chatMessage)
        .then(apiResponse => {
          // check for valid API response
          const data = { message: apiResponse };
          if (data && data.message) {
            console.log('MagickML Response:', data.message);

            // Set CORS headers explicitly
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // Allow requests from any origin
              'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });

            // Send the API response to the client
            res.end(JSON.stringify({ message: apiResponse }));
          } else {
            console.error('Invalid API response:', data);

            // Handle the error or display an appropriate message
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          }

          // Continue with the rest of your code...
        })
        .catch(error => {
          // Handle errors
          console.error('Error processing API request:', error);

          // Set CORS headers for error response
          res.writeHead(500, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*', // Allow requests from any origin
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          });

          // Send an error response to the client
          res.end('Internal Server Error');
        });
    } catch (error) {
      console.error('Error parsing JSON:', error);

      // Set CORS headers for bad request
      res.writeHead(400, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });

      // Send a bad request response to the client
      res.end('Bad Request');
    }
  });
}


// Interact with the chatbot by retrieving responses through a GET request
function interactWithChatbot(chatMessage) {
  const apiUrl = `${process.env.MAGICK_API_URL}/${process.env.MAGICK_AGENT_ID}?apiKey=${process.env.MAGICK_API_KEY}`;

  const requestBody = {
    id: process.env.MAGICK_AGENT_ID,
    apiKey: process.env.MAGICK_API_KEY,
    content: chatMessage
  };

  // Use GET method for retrieving chatbot responses
  return fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allow requests from any origin (adjust as needed)
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
    .then(response => response.json())
    .then(data => data.message)
    .catch(error => {
      // Handle errors
      console.error('Error interacting with chatbot:', error);
      throw error;
    });
}

export { processApiRequest, interactWithChatbot };
