module.exports = async (client, message) => {
    if (message.author.bot || message.content.indexOf(client.config.prefix) !== 0) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log(args, command);

    let commandToRun = null;

    if (client.commands.has(command)) {
        commandToRun = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        commandToRun = client.commands.get(client.aliases.get(command));
    }

    if (commandToRun) {
        commandToRun.run(client, message, args);
    } else {
        errAndMsg(message.channel, 'Invalid command.');
    }

    return;
};
