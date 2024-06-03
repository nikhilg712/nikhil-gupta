const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Fast response endpoint
app.get('/api/rest/fast', (req, res) => {
  res.json({ message: 'Fast response' });
});

// Slow response endpoint
app.get('/api/rest/slow', (req, res) => {
  setTimeout(() => {
    res.json({ message: 'Slow response' });
  }, 2000); // Simulate slow response
});

// GraphQL endpoint
app.post('/api/graphql', (req, res) => {
  res.json({ message: 'GraphQL response' });
});

// gRPC endpoint
app.post('/api/grpc', (req, res) => {
  res.json({ message: 'gRPC response' });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});
