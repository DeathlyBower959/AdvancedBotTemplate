//Helpful Imports
require('module-alias/register')


module.exports = {
  name: "ping",
  description: "The bots round-trip delay and server heartbeat",
  aliases: ['latency'],
  cooldown: 3, // Optional
  async execute(message, args, cmd, client, Discord, prefix) {

    const sent = await message.channel.send({ content: "Checking..." });
    const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
    const pingEmbed = new Discord.MessageEmbed()
      .setColor('#CCCC00')
      .setDescription(`🔂 **RTT**: ${timeDiff} ms\n💟 **Heartbeat**: ${Math.round(client.ws.ping)} ms`);

    return sent.edit({ content: 'Pong!', embeds: [pingEmbed] });

  }
}
