require('dotenv').config();
const Discord = require('discord.js');
const CronJob = require('cron').CronJob;

const { getChartData, getChartDataSource } = require('./chart.js');
const { getCalendarData, getCalendarDataSource } = require('./calendar.js');

const discordToken = process.env.DISCORD_TOKEN;
const client = new Discord.Client();

client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity(`Nico Nico Ni!`);

    const chartJob = new CronJob('0 0 8,20 * * *', () => {
        const topChartChannel = client.channels.find(ch => ch.name === 'top-charts');
        if (topChartChannel) {
            getChartData().then(chartData => {
                const embed = {
                    'author': {
                        'name': 'Top 15 Songs (Instiz)',
                        'url': getChartDataSource(),
                        'icon_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt1xxR4_XGo2yI11GgRf2ErhIvbClHgTfDr8RxILjvEjfTT6uoZA',
                    },
                    'color': 0x1FC679,
                    'fields': [],
                };

                chartData.map(chartSong => {
                    embed.fields.push({
                        'name': `${chartSong.rank}. ${chartSong.song} - ${chartSong.artist}`,
                        'value': `${chartSong.link || 'N/A'}`
                    });
                });

                topChartChannel.send({embed});
            });
        }
    }, null, true, 'America/New_York');

    const calendarJob = new CronJob('0 0 12 * * *', () => {
        const newReleasesChannel = client.channels.find(ch => ch.name === 'new-releases');
        if (newReleasesChannel) {
            getCalendarData().then(calendarData => {
                const embed = {
                    'author': {
                        'name': 'New Releases',
                        'url': getCalendarDataSource(),
                        'icon_url': 'https://yt3.ggpht.com/a-/AN66SAwl4t2Xp-dMiNe7tzRNX5WaVlbwst4emwd4ZA=s900-mo-c-c0xffffffff-rj-k-no',
                    },
                    'color': 0xD1002A,
                    'fields': [],
                };

                Object.keys(calendarData).map(releaseType => {
                    embed.fields.push({
                        'name': releaseType,
                        'value': calendarData[releaseType].map(release => `${release}\n`).join(''),
                    });
                });
                newReleasesChannel.send({embed});
            });
        }
    }, null, true, 'America/New_York');

    const xmasJob = new CronJob('0 0 8 25 12 *', () => {
        const generalChannel = client.channels.find(ch => ch.name === 'general');
        generalChannel.send('메리 크리스마스! Merry Christmas! :ribbon: :gift: :confetti_ball: :tada:');
    }, null, true, 'America/New_York');

    chartJob.start();
    calendarJob.start();
    xmasJob.start();
});

client.login(discordToken);
