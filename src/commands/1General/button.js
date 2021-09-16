const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "button",
    description: "Testing Button",
    cooldown: 0, // Optional
    deleteAfter: 0, // Optional (-1 = dont delete | 0 = insta delete | 0> = delete after x seconds)
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
  