//Helpful Imports
require('module-alias/register')
const { runSubCmd, getAllSubCmds } = require('@utils/subCommands')

const { MessageActionRow, MessageButton, MessageSelectMenu, SelectMenuInteraction } = require('discord.js');

module.exports = {
	name: "select",
	description: "A sample Select Menu example",
	cooldown: 0, // Optional
	onlyDebug: true,
	async execute(message, args, cmd, client, Discord, prefix) {

		if (runSubCmd(client.commands.get(cmd), args, { message: message, cmd: cmd, client: client, Discord: Discord, prefix: prefix }))
            return

		let menu1 = new MessageSelectMenu()
			.setCustomId('sample')
			.setPlaceholder('Nothing selected')
			.setMinValues(1)
			.setMaxValues(3)
			.addOptions(
				[
					{
						label: 'Option 1',
						description: 'A description',
						value: 'OPTION_ID',
					}, 
					{
						label: 'Option 2',
						description: 'A Second description',
						value: 'OPTION_ID2',
					}, 
					{
						label: 'Option 3',
						description: 'A Third description',
						value: 'OPTION_ID3',
					}
				])

		const row = new MessageActionRow()
			.addComponents(
				menu1
			);

		await message.channel.send({ content: 'Sample', components: [row] }).then(msg => {
			const sampleFilter = menu => menu.customId === 'sample' && menu.user.id === message.author.id;
			const sampleFilterCollector = msg.createMessageComponentCollector({ filter: sampleFilter, time: 10000 }); //10 seconds to use the button

			sampleFilterCollector.on('collect', async i => {
				await i.update({ content: `Selected Item ID[s]: \n${i.values?.map(x => `\`${x}\` `)}`, components: [row] })
			})

			sampleFilterCollector.on('end', async i => {
				await i.update({ content: `This interaction has timed out! Try running the command again`})
			})
		});

	}
}