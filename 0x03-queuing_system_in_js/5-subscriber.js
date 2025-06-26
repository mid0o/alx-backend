import redis from 'redis';

const subscriber = redis.createClient();
const channel = 'ALXchannel';

subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

subscriber.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// Subscribe to the channel to start listening.
subscriber.subscribe(channel);

// Handle incoming messages.
subscriber.on('message', (channelReceived, message) => {
  console.log(message);
  if (message === 'KILL_SERVER') {
    subscriber.unsubscribe(channel);
    subscriber.quit();
  }
});
