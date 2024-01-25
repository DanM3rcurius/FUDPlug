import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();

// Environment Variables
const MAGICK_API_KEY = process.env.MAGICK_API_KEY;
const MAGICK_AGENT_ID = process.env.MAGICK_AGENT_ID;
const MAGICK_API_URL = process.env.MAGICK_API_URL;

export function interactWithChatbot(content, method = 'POST') {
  let apiUrl = `${process.env.MAGICK_API_URL}/api`;

  const requestOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.MAGICK_API_KEY,
    },
  };

  if (method === 'POST') {
    const requestBody = JSON.stringify({
      agentId: process.env.MAGICK_AGENT_ID,
      content: content,
    });
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

      // Check if the request method is GET or POST
      const method = req.method;

      if (method === 'GET' || method === 'POST') {
        const { id, content } = jsonBody;
        interactWithChatbot({ id, content }, method)
          .then(apiResponse => {
            // Use cors middleware
            cors()(req, res, () => {
              // Preflight request, respond with success
              if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
              }

              res.end(JSON.stringify({ message: apiResponse }));
            });
          })
          .catch(error => {
            console.error('Error processing API request:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          });
      } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');
    }
  });
}