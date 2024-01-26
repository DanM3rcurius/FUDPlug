import http from 'http';
import cors from 'cors';
import { processApiRequest } from './apiHandler-01.mjs'; // Update the path accordingly


const server = http.createServer((req, res) => {

  // Use cors middleware
  cors()(req, res, () => {
    // Preflight request, respond with success
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Handle requests for API interactions
    if (req.method === 'GET' || req.method === 'POST') {
      handleApiRequest(req, res);
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