const { MessageCollector } = require('discord.js');
const helpEmbed = require('../embeds/helpEmbed.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');
const Utils = require('../utils/utils.js');
const { getYoutubeUrl } = require('../utils/youtube.js');

const configuration = {
    enabled: true,
    name: 'sendmv',
    aliases: [ 'linkmethat', 'mv' ],
    description: 'Send a link to a YouTube music video based on the search term.',
    usage: 'sendmv <SEARCH_TERM>',
};

module.exports = {
    conf: configuration,

    run: async (client, message, args) => {
        const searchTerm = args.join(' ');

        if (args.length < 1) {
            Utils.errAndMsg(message.channel, 'Invalid arguments.');
            helpEmbed(message, configuration);
        } else if (args[0] === HELP || args[0] === HELP_SHORT) {
            helpEmbed(message, configuration);
        } else {
            try {
                const toSend = await getYoutubeUrl(searchTerm);
                const botMsg = await message.channel.send(toSend.url);
                const replyCollector = new MessageCollector(botMsg.channel, replies => replies.author.id === message.author.id, { time: client.config.mvLinkDeletionTimeout } );
                replyCollector.on('collect', async reply => {
                    if (reply.content === 'bad bot') {
                        await botMsg.edit(`\`[deleted video]\``);
                        await message.channel.send(`Sorry about that.`);
                        replyCollector.stop();
                    }
                });
            } catch(err) {
                message.channel.send(`I couldn't find anything for ${searchTerm}.`)
                console.error(err);
            }
        }
        return;
    },
};

