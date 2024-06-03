const { routeRequest, forwardRequest, selectEndpointByCriteria, getRandomEndpoint } = require('../services/loadBalancerService');
const log4js = require('log4js');

// Set up logging
log4js.configure({
  appenders: { loadBalancer: { type: 'file', filename: 'load_balancer.log' } },
  categories: { default: { appenders: ['loadBalancer'], level: 'info' } }
});
const logger = log4js.getLogger('loadBalancer');

// Controller to handle incoming requests
const handleRequest = async (req, res) => {
  const { apiType, payloadSize } = req.query;

  try {
    // Route the request
    const endpoint = await routeRequest(apiType, payloadSize, selectEndpointByCriteria);

    // Forward the request to the chosen endpoint
    const response = await forwardRequest(req, endpoint);

    // Send the response back to the client
    res.status(response.status).json(response.data);

    // Log request details
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      endpoint: endpoint,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });

    // Log error details
    logger.error({
      method: req.method,
      url: req.originalUrl,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = { handleRequest };