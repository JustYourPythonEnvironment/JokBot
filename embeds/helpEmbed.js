const { RichEmbed } = require('discord.js');

module.exports = (message, conf) => {
    const embed = new RichEmbed()
        .setTitle(conf.name)
        .addField('**Description**', conf.description)
        .addField('**Usage**', conf.usage);

    if (conf.aliases.length > 0) {
        embed.addField('**Aliases**', conf.aliases);
    }

    message.channel.send(embed);
    return;
}

