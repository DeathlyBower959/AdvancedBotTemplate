
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
	id: "sample",
	async execute(interaction) {
		const selectedItem = interaction.values[0];
		const selectedItems = interaction.values;
		
		
		await interaction.reply({
			content: "This was a reply from select menu handler!\nBtw you chose: " + selectedItem,
		});

		//interaction.deferUpdate();

		return;
	},
};