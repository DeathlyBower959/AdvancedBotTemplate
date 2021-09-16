const { MessageActionRow, MessageButton } = require('discord.js');

const wait = require('util').promisify(setTimeout);

module.exports = {
	id: "sample",
	async execute(interaction) {
		
		await interaction.update({
			content: "This was a reply from button handler!",
		});
		await wait(1000);
		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('sample')
				.setLabel('Primary')
				.setStyle('PRIMARY'),
		);
		
		interaction.channel.send({content: "test", components: [row]})
		await interaction.editReply({
			content: "This was a reply from d handler!",
		});
		return;
	},
};