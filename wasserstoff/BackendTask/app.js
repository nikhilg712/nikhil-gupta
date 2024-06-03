const express = require('express');
const cors = require('cors');
const { handleRequest } = require('./controllers/apiController');

const app = express();
const PORT = 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Route to handle requests
app.get('/api/request', handleRequest);

app.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
