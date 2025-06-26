/**
 * This script connects to a local Redis server and logs connection status.
 */

import { createClient } from 'redis';

// Create a new Redis client
// By default, createClient will use 127.0.0.1 and port 6379
const client = createClient();

// Event listener for successful connection
// The 'connect' event is emitted when the connection is successfully established.
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event listener for connection errors
// The 'error' event is emitted when there's an issue with the connection.
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});
