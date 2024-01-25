import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

// Environment Variables
const MAGICK_API_KEY = process.env.MAGICK_API_KEY;
const MAGICK_AGENT_ID = process.env.MAGICK_AGENT_ID;
const MAGICK_API_URL = process.env.MAGICK_API_URL;

export function interactWithChatbot(chatMessage, method = 'POST') {
    let apiUrl = `${process.env.MAGICK_API_URL}/api`;  // Updated URL for both GET and POST requests
  
    const requestOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.MAGICK_API_KEY,
      }
    };
  
    if (method === 'POST') {
      // Include "content" and "id" in the request body for POST requests
      const requestBody = {
        content: chatMessage,
        agentId: process.env.MAGICK_AGENT_ID
      };
  
      requestOptions.body = JSON.stringify(requestBody);
    } else if (method === 'GET') {
      // Append "content" and "id" to the URL for GET requests
      apiUrl = `${apiUrl}/${process.env.MAGICK_AGENT_ID}?content=${encodeURIComponent(chatMessage)}`;
    }
  
    return fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => data.message)
      .catch(error => {
        console.error('Error interacting with chatbot:', error);
        throw error;
      });
  }

export function processApiRequest(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    console.log('Request body:', body);

    try {
      const jsonBody = JSON.parse(body);
      const chatMessage = jsonBody.content;

      // Check if the request method is GET or POST
      const method = req.method;

      interactWithChatbot(chatMessage, method)
        .then(apiResponse => {
          // Set CORS headers explicitly
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
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
