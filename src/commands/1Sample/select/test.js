module.exports = {
    name: "test",
    description: "a subcmd to select",
    cooldown: 3, // Optional
    subcommandsDir: 'testing',
	subcommands: [require('./testing/what')],
    async execute(message, args, cmd, client, Discord, prefix) {
  
      const timeTaken = Date.now() - message.createdTimestamp;
      const pingEmbed = new Discord.MessageEmbed()
      .setColor('#CCCC00')
      .setDescription(`🏓 Current Ping: ${timeTaken}ms.`);
  
      message.channel.send({embeds: [pingEmbed]});
  
    }
  }
  