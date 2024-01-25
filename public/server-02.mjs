import http from 'http';
import cors from 'cors';
import { processApiRequest } from './apiHandler-01.mjs'; // Update the path accordingly

function handleGetRequest(req, res) {
    // Check if the URL is '/api'
    if (req.url === '/api') {
      processApiRequest(req, res);
    } else {
      res.writeHead(501, { 'Content-Type': 'text/plain' });
      res.end('Unsupported method');
    }
  }
  
  function handlePostRequest(req, res) {
    if (req.url === '/api') {
      processApiRequest(req, res);
    } else {
      res.writeHead(501, { 'Content-Type': 'text/plain' });
      res.end('Unsupported method');
    }
  }

const server = http.createServer((req, res) => {
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

    // Handle requests for API interactions
    if (req.method === 'GET') {
      handleGetRequest(req, res);
    } else if (req.method === 'POST') {
      handlePostRequest(req, res);
    } else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});