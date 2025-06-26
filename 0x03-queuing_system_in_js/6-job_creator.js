import kue from 'kue';

// Create a Kue queue. Kue uses Redis to manage jobs.
const queue = kue.createQueue();

const jobData = {
  phoneNumber: '4153518780',
  message: 'This is the code to verify your account',
};

// Create a job in the 'push_notification_code' queue.
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (!err) {
      console.log(`Notification job created: ${job.id}`);
    }
  });

job.on('complete', () => {
  console.log('Notification job completed');
  // Exit the process once the job is done for a clean exit
  process.exit(0);
});

job.on('failed', () => {
  console.log('Notification job failed');
  process.exit(1);
});

