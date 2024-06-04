const express = require('express');
const { handleRequest } = require('./controllers/apiController');
const app = express();
const PORT = 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Route for handling requests
app.post('/api/request', handleRequest);
app.get('/api/request', handleRequest);

app.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
