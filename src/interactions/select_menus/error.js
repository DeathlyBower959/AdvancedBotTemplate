const { MessageActionRow, MessageButton } = require('discord.js');
const colors = require('colors')

module.exports = {
	id: "error",
	async execute(interaction) {
        console.log(`\nInvalid Button Interaction!\n  > Button ID: ${interaction.customId}`.red)
		interaction.deferUpdate();
	},
};