require('dotenv').config();
const Discord = require('discord.js');
const CronJob = require('cron').CronJob;

const { getChartData, getChartDataSource } = require('./scrape.js');

const discordToken = process.env.DISCORD_TOKEN;
const client = new Discord.Client();

client.on('ready', () => {
  console.log('Ready!');
  client.user.setActivity(`Nico Nico Ni!`);

    const job = new CronJob('0 0 8,20 * * *', () => {
        const topChartChannel = client.channels.find(ch => ch.name === 'top-charts');
        if (topChartChannel) {
            getChartData().then( chartData => {
                const embed = {
                    'author': {
                        'name': 'Top 15 Songs (Instiz)',
                        'url': getChartDataSource(),
                        'icon_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt1xxR4_XGo2yI11GgRf2ErhIvbClHgTfDr8RxILjvEjfTT6uoZA',
                    },
                    'color': 0x1FC679,
                    'fields': [],
                };

                chartData.map( chartSong => {
                    embed.fields.push({
                        'name': `${chartSong.rank}. ${chartSong.song} - ${chartSong.artist}`,
                        'value': `${chartSong.link || 'N/A'}`
                    });
                });

                topChartChannel.send( {embed} );
            });
        }
    }, null, true, 'America/New_York');

    job.start();
});

client.login(discordToken);
