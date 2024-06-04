// mockApiServer.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Fast response endpoint for REST API
app.get('/api/rest/fast', (req, res) => {
  res.json({ message: 'Fast response' });
});

// Slow response endpoint for REST API
app.get('/api/rest/slow', (req, res) => {
  setTimeout(() => {
    res.json({ message: 'Slow response' });
  }, 2000); // Simulate slow response
});

// Response endpoint for GraphQL API
app.post('/api/graphql', (req, res) => {
  res.json({ message: 'GraphQL response', data: req.body });
});

// Response endpoint for gRPC API
app.post('/api/grpc', (req, res) => {
  res.json({ message: 'gRPC response', data: req.body });
});

// Start the mock API server
app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});
