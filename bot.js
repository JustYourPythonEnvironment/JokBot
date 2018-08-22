require('dotenv').config();
const Discord = require('discord.js');
const CronJob = require('cron').CronJob;

const discordToken = process.env.DISCORD_TOKEN;
const client = new Discord.Client();

client.on('ready', () => {
  console.log('Ready!');
  client.user.setActivity(`Nico Nico Ni!`);

  const job = new CronJob('0 0 */4 * * *', function () {
    const topChartChannel = client.channels.find(ch => ch.name === 'top-charts');
    if (topChartChannel) topChartChannel.send('Checking in every 4 hours.');
  }, null, true, 'America/New_York');
  job.start();
});

client.login(discordToken);
