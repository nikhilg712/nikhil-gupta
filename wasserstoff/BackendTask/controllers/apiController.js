const { routeRequest, forwardRequest, selectEndpointByCriteria, enqueueRequest, dequeueRequest, queues } = require('../services/loadBalancerService');
const log4js = require('log4js');

// Set up logging
log4js.configure({
  appenders: { loadBalancer: { type: 'file', filename: 'logs/load_balancer.log' }, metrics: { type: 'file', filename: 'logs/metrics.log' } },
  categories: { default: { appenders: ['loadBalancer'], level: 'info' }, metrics: { appenders: ['metrics'], level: 'info' } }
});
const logger = log4js.getLogger('loadBalancer');
const metricsLogger = log4js.getLogger('metrics');

const logMetrics = (queueType, startTime, endTime, request) => {
  const duration = endTime - startTime;
  metricsLogger.info({
    queueType,
    duration,
    method: request.req.method,
    url: request.req.originalUrl,
    payloadSize: request.payloadSize,
    timestamp: new Date().toISOString()
  });
};

// Controller to handle incoming requests
const handleRequest = async (req, res) => {
  const { apiType, payloadSize, queueType = 'fifo' } = req.query;

  try {
    // Enqueue the request
    enqueueRequest(queueType, { req, res, apiType, payloadSize });

    // Process the request from the queue
    processQueue(queueType);

  } catch (error) {
    res.status(500).json({ error: error.message });
    logger.error({ method: req.method, url: req.originalUrl, error: error.message, timestamp: new Date().toISOString() });
  }
};

const processQueue = async (queueType) => {
  while (!queues[queueType].isEmpty()) {
    const request = dequeueRequest(queueType);

    const startTime = Date.now();
    try {
      const endpoint = await routeRequest(request.apiType, request.payloadSize, selectEndpointByCriteria);
      const response = await forwardRequest(request.req, endpoint);

      request.res.status(response.status).json(response.data);
      logger.info({ method: request.req.method, url: request.req.originalUrl, status: request.res.statusCode, endpoint: endpoint, timestamp: new Date().toISOString() });

    } catch (error) {
      request.res.status(500).json({ error: error.message });
      logger.error({ method: request.req.method, url: request.req.originalUrl, error: error.message, timestamp: new Date().toISOString() });
    }
    const endTime = Date.now();
    logMetrics(queueType, startTime, endTime, request);
  }
};

module.exports = { handleRequest };
