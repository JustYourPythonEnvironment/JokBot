const CronJob = require('cron').CronJob;

const { getChartData, getChartDataSource } = require('../utils/chart.js');
const { generateCalendarEmbed } = require('../utils/calendar.js');

module.exports = async (client) => {
    console.log('Ready!');
    client.user.setActivity(`Nico Nico Ni!`);

    const chartJob = new CronJob('0 0 8,20 * * *', async () => {
        const topChartChannel = client.channels.find(ch => ch.name === 'top-charts');
        if (topChartChannel) {
            const chartData = await getChartData();
            const embed = {
                'author': {
                    'name': 'Top 15 Songs (Instiz)',
                    'url': getChartDataSource(),
                    'icon_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt1xxR4_XGo2yI11GgRf2ErhIvbClHgTfDr8RxILjvEjfTT6uoZA',
                },
                'color': 0x1FC679,
                'fields': [],
            };

            chartData.forEach(chartSong => {
                embed.fields.push({
                    'name': `${chartSong.rank}. ${chartSong.song} - ${chartSong.artist}`,
                    'value': `${chartSong.link || 'N/A'}`
                });
            });

            await topChartChannel.send({embed});
        }
    }, null, true, 'America/New_York');

    const calendarJob = new CronJob('0 0 21 * * *', async () => {
        const newReleasesChannel = client.channels.find(ch => ch.name === 'new-releases');
        if (newReleasesChannel) {
            const previousMessagesInChannel = await newReleasesChannel.fetchMessages({limit: 3});
            const previousChartUpdatesFromBot = previousMessagesInChannel.filter(m => m.author.id === client.user.id);
            if (previousChartUpdatesFromBot.size > 0) {
                const previousChartUpdate = previousChartUpdatesFromBot.first();
                const previousDayEmbed = await generateCalendarEmbed(1);
                previousChartUpdate.edit({embed: previousDayEmbed})
            }

            const currentDayEmbed = await generateCalendarEmbed();
            await newReleasesChannel.send({embed: currentDayEmbed});
        }
    }, null, true, 'America/New_York');

    const xmasJob = new CronJob('0 0 8 25 12 *', () => {
        const generalChannel = client.channels.find(ch => ch.name === 'general');
        generalChannel.send('메리 크리스마스! Merry Christmas! :ribbon: :gift: :confetti_ball: :tada:');
    }, null, true, 'America/New_York');

    chartJob.start();
    calendarJob.start();
    xmasJob.start();
};
