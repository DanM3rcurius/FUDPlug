import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import cors from 'cors';


// Environment Variables
const MAGICK_API_KEY = process.env.MAGICK_API_KEY;
const MAGICK_AGENT_ID = process.env.MAGICK_AGENT_ID;
const MAGICK_API_URL = process.env.MAGICK_API_URL;

export function interactWithChatbot(content, method = 'POST') {
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
        agentId: process.env.MAGICK_AGENT_ID,
        content: content
      };
  
      requestOptions.body = JSON.stringify(requestBody);

  
    return fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => data.message)
      .catch(error => {
        console.error('Error interacting with chatbot:', error);
        throw error;
      });
  }}

export function processApiRequest(req, res) {
  const jsonBody = JSON.parse(body);
  const content = jsonBody.content;
  const id = jsonBody.id;
  const apiKey = jsonBody.apiKey;
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    console.log('Request body:', body);

    try {
      const jsonBody = JSON.parse(body);
      const content = jsonBody.content;

      // Check if the request method is GET or POST
      const method = req.method;

      interactWithChatbot(content, method)
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
