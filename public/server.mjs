import http from 'http';
import { processApiRequest, interactWithChatbot } from './apiHandler.mjs'; // Update the path accordingly

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Handle GET requests for API interactions
    processApiRequest(req, res);
  } else if (req.method === 'POST') {
    // Handle POST requests for API interactions
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
