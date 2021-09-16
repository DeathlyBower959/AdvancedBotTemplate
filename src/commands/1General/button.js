const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "button",
    description: "Testing Button",
    cooldown: 0, // Optional
    onlyDebug: true,
    async execute(message, args, cmd, client, Discord, prefix) {
  
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('sample')
                .setLabel('Sample Button')
                .setStyle('PRIMARY'),
        );
        
        await message.channel.send({ content: 'Testing a message', components: [row] });
  
    }
  }
  