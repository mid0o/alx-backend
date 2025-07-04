import kue from 'kue';

const queue = kue.createQueue();

const jobs = [
  { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
  { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' },
  // ... (add all other job objects from the task description)
  { phoneNumber: '4151218782', message: 'This is the code 4321 to verify your account' }
];

console.log('Creating jobs...');
jobs.forEach((jobData) => {
  const job = queue.create('push_notification_code_2', jobData)
    .save((err) => {
      if (!err) console.log(`Notification job created: ${job.id}`);
    });

  job.on('complete', () => console.log(`Notification job ${job.id} completed`));
  job.on('failed', (errorMessage) => console.log(`Notification job ${job.id} failed: ${errorMessage}`));
  job.on('progress', (progress) => console.log(`Notification job ${job.id} ${progress}% complete`));
});
