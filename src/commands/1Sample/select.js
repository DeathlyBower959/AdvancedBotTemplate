const { MessageActionRow, MessageButton, MessageSelectMenu, SelectMenuInteraction } = require('discord.js');

module.exports = {
	name: "select",
	description: "A sample Select Menu example",
	cooldown: 0, // Optional
	onlyDebug: true,
	async execute(message, args, cmd, client, Discord, prefix) {

		const subCmd = client.commands.get(cmd).subcmds.find(x => x.cmd.name.toLowerCase() == args[0]?.toString().toLowerCase())?.cmd
		if (subCmd) {
			subCmd.execute(message, args, cmd, client, Discord, prefix)
			return;
		}

		let menu1 = new MessageSelectMenu()
			.setCustomId('sample')
			.setPlaceholder('Nothing selected')
			.setMinValues(2)
			.setMaxValues(2)
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
				await i.update({ content: `Select Menu Option ID[s]: \n${i.values?.map(x => `\`${x}\` `)}`, components: [row] })
			})
		});

	}
}