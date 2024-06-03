const axios = require('axios');

// Mock API endpoints
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
  const healthyEndpoints = endpoints.filter(endpoint => endpoint.health);
  if (healthyEndpoints.length === 0) {
    return endpoints[0].url;
  }
  healthyEndpoints.sort((a, b) => a.load - b.load);
  return healthyEndpoints[0].url;
};

// Randomized routing to simulate server load balancing
const getRandomEndpoint = (endpoints) => {
  const randomIndex = Math.floor(Math.random() * endpoints.length);
  return endpoints[randomIndex].url;
};

// Routing logic based on criteria
const routeRequest = async (apiType, payloadSize, customCriteria) => {
  let endpoint;

  if (apiType === 'REST') {
    if (payloadSize && payloadSize > 1000) {
      endpoint = endpoints.REST[1].url;
    } else {
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
