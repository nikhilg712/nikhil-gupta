const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

app.get('/api/rest/fast', (req, res) => {
  res.json({ message: 'Fast response' });
});

app.get('/api/rest/slow', (req, res) => {
  setTimeout(() => {
    res.json({ message: 'Slow response' });
  }, 2000); // Simulate slow response
});

app.post('/api/graphql', (req, res) => {
  res.json({ message: 'GraphQL response', payload: req.body });
});

app.post('/api/grpc', (req, res) => {
  res.json({ message: 'gRPC response', payload: req.body });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
});
