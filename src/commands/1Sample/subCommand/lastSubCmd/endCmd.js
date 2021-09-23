module.exports = {
    name: "endcmd",
    description: "Ending Sub command",
    cooldown: 3, // Optional
    async execute(message, args, cmd, client, Discord, prefix) {
  
      message.channel.send({ content: `A subcommand of ${cmd} was run!` })
  
    }
  }
  