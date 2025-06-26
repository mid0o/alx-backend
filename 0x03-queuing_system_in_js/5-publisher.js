import redis from 'redis';

const publisher = redis.createClient();
const channel = 'ALXchannel';

publisher.on('connect', () => {
  console.log('Redis client connected to the server');
});

publisher.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

/**
 * Publishes a message to a Redis channel after a specified delay.
 * @param {string} message - The message to publish.
 * @param {number} time - The delay in milliseconds.
 */
function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisher.publish(channel, message);
  }, time);
}

publishMessage("ALX Student #1 starts course", 100);
publishMessage("ALX Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("ALX Student #3 starts course", 400);

// Quit after the last message is scheduled to avoid a hanging process
setTimeout(() => publisher.quit(), 500);
