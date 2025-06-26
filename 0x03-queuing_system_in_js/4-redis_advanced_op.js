import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

const hashKey = 'ALX';
const hashValues = {
  Portland: '50',
  Seattle: '80',
  'New York': '20',
  Bogota: '20',
  Cali: '40',
  Paris: '2',
};

// Loop through the hash values and set them in Redis
for (const [field, value] of Object.entries(hashValues)) {
  client.hset(hashKey, field, value, redis.print);
}

// Retrieve the entire hash and log it
client.hgetall(hashKey, (err, object) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(object);
  client.quit();
});
