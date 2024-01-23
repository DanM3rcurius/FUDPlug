const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    handleGetRequest(req, res);
  } else if (req.method === 'POST') {
    handlePostRequest(req, res);
  } else {
    res.writeHead(501, { 'Content-Type': 'text/plain' });
    res.end('Unsupported method');
  }
});

function handleGetRequest(req, res) {
  // Handle GET requests
  if (req.url === '/api') {
    // Handle /api endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from /api' }));
  } else {
    serveStaticFile(req, res);
  }
}

function handlePostRequest(req, res) {
  // Handle POST requests
  if (req.url === '/api') {
    processApiRequest(req, res);
  } else {
    res.writeHead(501, { 'Content-Type': 'text/plain' });
    res.end('Unsupported method');
  }
}

function processApiRequest(req, res) {
  // Process the /api POST request body here
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    console.log('POST body:', body);

    // Respond with a simple message
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'POST request received at /api' }));
  });
}

function serveStaticFile(req, res) {
  // Serve HTML, CSS, JS files
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const contentType = getContentType(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

function getContentType(filePath) {
  // Determine Content-Type based on file extension
  const extname = path.extname(filePath).toLowerCase();
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    default:
      return 'application/octet-stream';
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
