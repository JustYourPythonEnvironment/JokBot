const { RichEmbed } = require('discord.js');

const configuration = {
    enabled: true,
    name: 'help',
    aliases: ['commands'],
    description: 'Displays a list of available commands.',
    usage: 'help',
};

module.exports = {
    conf: configuration,

    run: (client, message, args) => {
        const { commands } = client;
        const commandList = new RichEmbed()
            .setTitle(`Here are a list of available commands and their aliases.`);

        let description = "";

        commands.forEach( command => {
            try {
                description = `${description}\n**${command.conf.name}** - (${command.conf.aliases.join(', ')})`;
            } catch (err) {
                console.log(err);
            }
        });
        commandList.setDescription(description);
        message.channel.send(commandList);
        return;
    },
};

