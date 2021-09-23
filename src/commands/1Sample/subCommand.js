const subCmdsLib = require('../../utils/subCommands')

module.exports = {
    name: "subcommand",
    description: "A sample of a command with subcommands",
    cooldown: 0, // Optional
    subcommands: [require('./subCommand/cmdWithSubCmd')],
    onlyDebug: true,
    async execute(message, args, cmd, client, Discord, prefix) {

        if (subCmdsLib.runSubCmd(client.commands.get(cmd), args, { message: message, cmd: cmd, client: client, Discord: Discord, prefix: prefix }))
            return

        message.channel.send({ content: `The command **${cmd}** was run!` })

    }
}