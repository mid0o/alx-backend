import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
// Promisify the client.get method to use it with async/await
const getAsync = promisify(client.get).bind(client);

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
}

/**
 * Gets the value of a key from Redis using async/await.
 * @param {string} schoolName - The key to retrieve.
 */
async function displaySchoolValue(schoolName) {
  try {
    const reply = await getAsync(schoolName);
    console.log(reply);
  } catch (err) {
    console.error(err);
  }
}

// Using an async main function to orchestrate the calls
async function main() {
  await displaySchoolValue('ALX');
  setNewSchool('ALXSanFrancisco', '100');
  await displaySchoolValue('ALXSanFrancisco');
  // Quit the client gracefully after operations
  client.quit();
}

main();
