const axios = require('axios');

// Mock API endpoints with health status and load
const endpoints = {
  REST: [
    { url: 'http://localhost:3000/api/rest/fast', health: true, load: 5 },
    { url: 'http://localhost:3000/api/rest/slow', health: true, load: 10 }
  ],
  GraphQL: [{ url: 'http://localhost:3000/api/graphql', health: true, load: 3 }],
  gRPC: [{ url: 'http://localhost:3000/api/grpc', health: true, load: 7 }]
};

// Custom criteria for selecting endpoints based on load
const selectEndpointByCriteria = (endpoints) => {
  // Filter only healthy endpoints
  const healthyEndpoints = endpoints.filter(endpoint => endpoint.health);
  
  // If no healthy endpoints, fall back to the first one
  if (healthyEndpoints.length === 0) {
    return endpoints[0].url;
  }
  
  // Sort healthy endpoints by load (ascending) and select the one with the least load
  healthyEndpoints.sort((a, b) => a.load - b.load);
  return healthyEndpoints[0].url;
};

// Randomized routing to simulate server load balancing
const getRandomEndpoint = (endpoints) => {
  // Randomly select an endpoint
  const randomIndex = Math.floor(Math.random() * endpoints.length);
  return endpoints[randomIndex].url;
};

// Routing logic based on criteria
const routeRequest = async (apiType, payloadSize, customCriteria) => {
  let endpoint;

  // Determine endpoint based on API type and payload size
  if (apiType === 'REST') {
    if (payloadSize && payloadSize > 1000) {
      endpoint = endpoints.REST[1].url; // Slow endpoint for large payload
    } else {
      // Use custom criteria if provided, else use randomized routing
      endpoint = customCriteria ? customCriteria(endpoints.REST) : getRandomEndpoint(endpoints.REST);
    }
  } else if (apiType === 'GraphQL') {
    endpoint = customCriteria ? customCriteria(endpoints.GraphQL) : getRandomEndpoint(endpoints.GraphQL);
  } else if (apiType === 'gRPC') {
    endpoint = customCriteria ? customCriteria(endpoints.gRPC) : getRandomEndpoint(endpoints.gRPC);
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

module.exports = { routeRequest, forwardRequest, selectEndpointByCriteria, getRandomEndpoint };
