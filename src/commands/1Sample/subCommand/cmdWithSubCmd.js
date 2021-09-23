const subCmdsLib = require('../../utils/subCommands')

module.exports = {
  name: "cmdwithsubcmd",
  description: "a subcmd to select",
  cooldown: 3, // Optional
  subcommands: [require('./lastSubCmd/endCmd')],
  async execute(message, args, cmd, client, Discord, prefix) {

    if (subCmdsLib.runSubCmd(client.commands.get(cmd), args, { message: message, cmd: cmd, client: client, Discord: Discord, prefix: prefix }))
      return

    message.channel.send({ content: `A subcommand of ${cmd} was run!` })

  }
}
