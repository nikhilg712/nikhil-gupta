const axios = require('axios');
const { FIFOQueue, PriorityQueue, RoundRobinQueue } = require('./queueService');

const queues = {
  fifo: new FIFOQueue(),
  priority: new PriorityQueue(),
  roundRobin: new RoundRobinQueue()
};

queues.roundRobin.addQueue(); // Add initial queue for round-robin
queues.roundRobin.addQueue(); // Add additional queues as needed

const endpoints = {
  REST: [
    { url: 'http://localhost:3000/api/rest/fast', health: true, load: 5 },
    { url: 'http://localhost:3000/api/rest/slow', health: true, load: 10 }
  ],
  GraphQL: [{ url: 'http://localhost:3000/api/graphql', health: true, load: 3 }],
  gRPC: [{ url: 'http://localhost:3000/api/grpc', health: true, load: 7 }]
};

// Custom criteria for selecting endpoints
const selectEndpointByCriteria = (endpoints) => {
  const healthyEndpoints = endpoints.filter(endpoint => endpoint.health);
  if (healthyEndpoints.length === 0) {
    return endpoints[0].url;
  }
  healthyEndpoints.sort((a, b) => a.load - b.load);
  return healthyEndpoints[0].url;
};

// Routing logic based on criteria
const routeRequest = async (apiType, payloadSize, customCriteria) => {
  let endpoint;
  if (apiType === 'REST') {
    if (payloadSize && payloadSize > 1000) {
      endpoint = endpoints.REST[1].url;
    } else {
      endpoint = customCriteria ? customCriteria(endpoints.REST) : endpoints.REST[0].url;
    }
  } else if (apiType === 'GraphQL') {
    endpoint = customCriteria ? customCriteria(endpoints.GraphQL) : endpoints.GraphQL[0].url;
  } else if (apiType === 'gRPC') {
    endpoint = customCriteria ? customCriteria(endpoints.gRPC) : endpoints.gRPC[0].url;
  } else {
    throw new Error('Unsupported API type');
  }
  return endpoint;
};

// Function to forward requests to the chosen endpoint
const forwardRequest = async (req, endpoint) => {
  return await axios({
    method: req.method,
    url: endpoint,
    data: req.body
  });
};

const enqueueRequest = (queueType, request) => {
  if (queueType === 'priority') {
    request.priority = request.payloadSize; // Assuming payload size determines priority
  }
  queues[queueType].enqueue(request);
};

const dequeueRequest = (queueType) => {
  return queues[queueType].dequeue();
};

module.exports = { routeRequest, forwardRequest, selectEndpointByCriteria, enqueueRequest, dequeueRequest, queues };
