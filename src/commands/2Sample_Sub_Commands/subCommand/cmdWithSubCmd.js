//Helpful Imports
require('module-alias/register')
const { runSubCmd, getAllSubCmds } = require('@utils/subCommands')

module.exports = {
  name: "cmdwithsubcmd",
  description: "a subcmd to select",
  cooldown: 3, // Optional
  subcommands: [require('./cmdWithSubCmd/endCmd')],
  onlyDebug: true,
  async execute(message, args, cmd, client, Discord, prefix, currentCmd, parentCommand, argsIndex) {

    if (runSubCmd(currentCmd, args, { message: message, cmd: cmd, client: client, Discord: Discord, prefix: prefix }, argsIndex))
      return

    message.channel.send({ content: `A subcommand of **${parentCommand.cmd.name}** was run!` })

  }
}
