const { MessageCollector } = require('discord.js');
const helpEmbed = require('../embeds/helpEmbed.js');
const { HELP, HELP_SHORT } = require('../assets/flags.json');
const Utils = require('../utils/utils.js');
const { getCCLyricsUrl } = require('../utils/cclyrics.js');

const configuration = {
    enabled: true,
    name: 'lyrics',
    aliases: [ 'ccl' ],
    description: `Send a link to a song's lyrics based on the search term.`,
    usage: 'lyrics <SEARCH_TERM>',
};

module.exports = {
    conf: configuration,

    run: async (client, message, args) => {
        const searchTerm = args.join(' ');

        if (args[0] === HELP || args[0] === HELP_SHORT || args.length < 1) {
            helpEmbed(message, configuration);
            Utils.errAndMsg(message.channel, 'Invalid arguments.');
        } else {
            try {
                const toSend = await getCCLyricsUrl(searchTerm);
                const botMsg = await message.channel.send(toSend);
                const replyCollector = new MessageCollector(botMsg.channel, replies => replies.author.id === message.author.id, { time: client.config.mvLinkDeletionTimeout } );
                replyCollector.on('collect', async reply => {
                    if (reply.content === 'bad bot') {
                        await botMsg.edit(`Shoot! Let me delete that link.`);
                        await message.channel.send(`Sorry for sending that.`);
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

