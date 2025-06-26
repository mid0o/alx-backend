import kue from 'kue';

const queue = kue.createQueue();

/**
 * Simulates sending a notification.
 * @param {string} phoneNumber
 * @param {string} message
 */
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Set up the queue processor to listen for new jobs on 'push_notification_code'.
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  // `done()` tells Kue the job was processed successfully.
  done();
});
