import http from 'http';
import cors from 'cors';
import { processApiRequest, interactWithChatbot } from './apiHandler.mjs'; // Update the path accordingly

const server = http.createServer((req, res) => {
  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allow the necessary methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  // Allow the necessary headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Enable CORS for all routes
  cors()(req, res, () => {
    if (req.method === 'GET') {
      handleGetRequest(req, res);
    } else if (req.method === 'POST') {
      handlePostRequest(req, res);
    } else {
      res.writeHead(501, { 'Content-Type': 'text/plain' });
      res.end('Unsupported method');
    }
  });
  if (req.method === 'OPTIONS') {
    // Preflight request, respond with success
    res.writeHead(200);
    res.end();
    return;
  }
  if (req.method !== 'OPTIONS') {
    // Handle requests for API interactions
    processApiRequest(req, res);
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
