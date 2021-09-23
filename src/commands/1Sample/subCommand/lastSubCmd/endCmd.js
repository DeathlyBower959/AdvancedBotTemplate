module.exports = {
    name: "endcmd",
    description: "Ending Sub command",
    cooldown: 3, // Optional
    onlyDebug: true,
    async execute(message, args, cmd, client, Discord, prefix, currentCmd, parentCommand) {
  
      message.channel.send({ content: `A subcommand3 of **${parentCommand.cmd.name}** was run!` })
  
    }
  }
  