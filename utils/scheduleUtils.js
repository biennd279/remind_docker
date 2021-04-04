// TODO: Implement a way to store scheduled job so the client can reschedule, cancel the job as needed.
const schedule = require("node-schedule");

/**
 * Schedule a cron job to run repeatedly and return the cron-job object.
 * @param {String} expression cron job's expression (ex. 42 * * * *)
 * @param {Function} handler task to run
 * @returns cron job's object
 */
exports.schedule = (expression, handler) => {
  return schedule.scheduleJob(expression, handler);
};

/**
 * Schedule the task to run once on the given date.
 * @param {Date} date when to run the handler
 * @param {Function} handler
 */
exports.scheduleOnce = (date, handler) => {
  return schedule.scheduleJob(date, handler);
};

// For testing purposes
if (require.main === module) {
  let message = "What..." + Date.now();
  // handler's only parameter is the date when the job was fired.
  const repeatedTask = schedule.scheduleJob("* * * * * *", (currentDate) => {
    message = "What..." + Date.now();
    console.log(message);
    console.log(currentDate);
  });

  const laterDate = new Date(Date.now() + 5000).toISOString();
  const oneTimeTask = exports.scheduleOnce(laterDate, function (x) {
    console.log(x);
    console.log("What");
  });
}
