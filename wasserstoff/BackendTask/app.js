// app.js
const express = require('express');
const cors = require('cors');
const { handleRequest } = require('./controllers/apiController');
const app = express();
const PORT = 4000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Route to handle incoming API requests
app.all('/api/request', handleRequest);

// Start the load balancer server
app.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
