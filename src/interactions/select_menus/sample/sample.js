
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
	id: "sample",
	async execute(interaction) {
		const selectedItemID = interaction.values[0];
		const selectedItemIDs = interaction.values;
		
		
		await interaction.reply({
			content: "This was a reply from select menu handler!\nChosen ID: " + selectedItemID,
			ephemeral: true
		});

		//interaction.deferUpdate();

		return;
	},
};