module.exports = {
    name: "subcmd",
    description: "a subcmd to select",
    cooldown: 3, // Optional
    async execute(message, args, cmd, client, Discord, prefix) {
  
      const timeTaken = Date.now() - message.createdTimestamp;
      const pingEmbed = new Discord.MessageEmbed()
      .setColor('#CCCC00')
      .setDescription(`🏓 Current Ping: ${timeTaken}ms.`);
  
      message.channel.send({embeds: [pingEmbed]});
  
    }
  }
  