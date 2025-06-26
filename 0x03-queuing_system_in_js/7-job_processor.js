import kue from 'kue';

const blacklistedNumbers = ['4153518780', '4153518781'];
const queue = kue.createQueue();

/**
 * Processes a notification job, handling blacklisted numbers and progress.
 * @param {string} phoneNumber
 * @param {string} message
 * @param {object} job - The Kue job object.
 * @param {function} done - The callback to signal completion or failure.
 */
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100);

  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job immediately if the number is blacklisted.
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // Report 50% progress.
  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  // Signal successful completion.
  done();
}

// Process jobs on 'push_notification_code_2' queue, two at a time.
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
