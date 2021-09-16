module.exports = {
    name: "ping",
    description: "Gets the latency of the bot",
    cooldown: 3, // Optional
    deleteAfter: 0, // Optional (-1 = dont delete | 0 = insta delete | 0> = delete after x seconds)
    async execute(message, args, cmd, client, Discord, prefix) {
  
      const timeTaken = Date.now() - message.createdTimestamp;
      const pingEmbed = new Discord.MessageEmbed()
      .setColor('#CCCC00')
      .setDescription(`🏓 Current Ping: ${timeTaken}ms.`);
  
      message.channel.send({embeds: [pingEmbed]});
  
    }
  }
  