var CronJob = require('cron').CronJob;
new CronJob('15 * * * * *', function() {
  console.log('You will see this message every 15 seconds');
}, null, true, 'America/New_York');

new CronJob('30 * * * * *', function() {
  console.log('You will see this message every 30 seconds');
}, null, true, 'America/New_York');

