import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

const app = express();
const port = 1245;

// --- Redis Setup ---
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// --- Kue Setup ---
const queue = kue.createQueue();

// --- App State ---
let reservationEnabled = true;
const INITIAL_SEATS = 50;

async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats');
  return seats ? parseInt(seats) : 0;
}

// --- Express Routes ---
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: numberOfAvailableSeats.toString() });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });

  job.on('complete', () => console.log(`Seat reservation job ${job.id} completed`));
  job.on('failed', (err) => console.log(`Seat reservation job ${job.id} failed: ${err}`));
});

app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    let availableSeats = await getCurrentAvailableSeats();
    availableSeats -= 1;
    
    if (availableSeats >= 0) {
      await reserveSeat(availableSeats);
      if (availableSeats === 0) {
        reservationEnabled = false;
      }
      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });
});

// --- Server Start ---
app.listen(port, async () => {
  // Initialize available seats in Redis on startup
  await reserveSeat(INITIAL_SEATS);
  console.log(`Server listening on port ${port}`);
});
