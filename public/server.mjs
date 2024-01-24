import http from 'http';
import { processApiRequest, interactWithChatbot } from './apiHandler.mjs'; // Update the path accordingly

const server = http.createServer((req, res) => {

  if (req.method === 'OPTIONS') {
    // Preflight request, respond with success
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' || req.method === 'POST') {
    // Handle GET or POST requests for API interactions
    processApiRequest(req, res);
  } else {
    res.writeHead(501, { 'Content-Type': 'text/plain' });
    res.end('Unsupported method');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
