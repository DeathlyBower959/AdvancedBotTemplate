//Helpful Imports
require('module-alias/register')
const {permissionsInteger} = require('@root/config.json')
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: "invite",
    description: "Gets the bots invite link",
    cooldown: 5, // Optional
    async execute(message, args, cmd, client, Discord, prefix) {

        const pingEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Invite')
            .setDescription(`You can invite the bot by clicking the button below!`);

        let inviteButton = new MessageButton()
            .setLabel('Invite')
            .setStyle('LINK')
            .setURL(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=${permissionsInteger}`)

        let deleteButton = new MessageButton()
            .setCustomId('deleteEmbed')
            .setLabel('🗑️')
            .setStyle('DANGER')

        const row = new MessageActionRow()
            .addComponents(
                inviteButton,
                deleteButton
            );

        await message.channel.send({ embeds: [pingEmbed], components: [row] }).then(msg => {
            const deleteEmbedFilter = btn => btn.customId === 'deleteEmbed' && btn.user.id === message.author.id;
            const deleteEmbedCollector = msg.createMessageComponentCollector({ filter: deleteEmbedFilter, time: 20000 }); //10 seconds to use the button

            deleteEmbedCollector.on('collect', async i => {
                if (msg) msg.delete()
            })
        });

    }
}
