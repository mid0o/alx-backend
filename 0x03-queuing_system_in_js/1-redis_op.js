import redis from 'redis';

// Create a Redis client.
const client = redis.createClient();

// Listen for the 'connect' event to confirm connection.
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Listen for the 'error' event to handle connection issues.
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

/**
 * Sets a new value for a given key in Redis.
 * redis.print is a helper function that prints "Reply: OK" on success.
 * @param {string} schoolName - The key to set.
 * @param {string} value - The value to set for the key.
 */
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
}

/**
 * Gets the value of a key from Redis and logs it.
 * This function uses a callback to handle the asynchronous response.
 * @param {string} schoolName - The key to retrieve.
 */
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, reply) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(reply);
  });
}

// --- Function Calls ---
displaySchoolValue('ALX');
setNewSchool('ALXSanFrancisco', '100');
displaySchoolValue('ALXSanFrancisco');
