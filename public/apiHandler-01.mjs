import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();

// Environment Variables
const MAGICK_API_KEY = process.env.MAGICK_API_KEY;
const MAGICK_AGENT_ID = process.env.MAGICK_AGENT_ID;
const MAGICK_API_URL = process.env.MAGICK_API_URL;

export function interactWithChatbot(prompt, method = 'POST') {
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
      0: {
        json: {
          agentId: process.env.MAGICK_AGENT_ID,
          prompt: prompt,
          client: "localhost", 
          sessionId: "a355f623-fa09-4a20-ae67-0cf3ez90fd5e", 
          sender: "b74202bf-b373-40a1-bc2a-61dec89d4275",
        },
      },
    });

    requestOptions.body = requestBody;  // Set the body property in requestOptions
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
        const { id, prompt } = jsonBody;
        interactWithChatbot({ id, prompt }, method)
          .then(apiResponse => {
            // Allow requests from any origin
            res.setHeader('Access-Control-Allow-Origin', '*');
            // Allow the necessary methods
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            // Allow the necessary headers
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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