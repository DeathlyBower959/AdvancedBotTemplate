const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: "select",
    description: "Testing select menus",
    cooldown: 0, // Optional
    deleteAfter: 0, // Optional (-1 = dont delete | 0 = insta delete | 0> = delete after x seconds)
    onlyDebug: true,
    async execute(message, args, cmd, client, Discord, prefix) {
  
        const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
					.setCustomId('sample')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
						{
							label: 'I am also an option',
							description: 'This is a description as well',
							value: 'third_option',
						},
					]),
        );

        await message.channel.send({ content: 'Testing a message', components: [row] });
  
    }
  }
  