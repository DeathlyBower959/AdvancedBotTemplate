const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    id: "firstPage",
    async execute(interaction) {

        interaction.deferUpdate();
        return;
    },
};
