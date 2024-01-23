import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
const MAGICK_API_KEY = process.env.MAGICK_API_KEY; 
const MAGICK_AGENT_ID = process.env.MAGICK_AGENT_ID; 
const MAGICK_API_URL = process.env.MAGICK_API_URL; 


const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    serveStaticFile(req, res);
  } else if (req.method === 'POST') {
    handlePostRequest(req, res);
  } else {
    res.writeHead(501, { 'Content-Type': 'text/plain' });
    res.end('Unsupported method');
  }
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
          res.writeHead(200, { 'Content-Type': 'application/json' });
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
  const apiUrl = `${process.env.MAGICK_API_URL}/api/${process.env.MAGICK_AGENT_ID}?apiKey=${process.env.MAGICK_API_KEY}`;
;

  const requestBody = {
    id: agentId,
    apiKey: apiKey,
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
