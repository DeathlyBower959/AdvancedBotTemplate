//Helpful Imports
require('module-alias/register')
const { MessageButton, MessageActionRow, Permissions, MessageEmbed} = require('discord.js');

module.exports = {
    name: "invite",
    description: "Gets the bots invite link",
    cooldown: 5, // Optional
    async execute(message, args, cmd, client, Discord, prefix) {

        const invite = await client.generateInvite({
            permissions: [
                Permissions.FLAGS.CHANGE_NICKNAME,
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.EMBED_LINKS,
                Permissions.FLAGS.ATTACH_FILES,
                Permissions.FLAGS.READ_MESSAGE_HISTORY,
                Permissions.FLAGS.ADD_REACTIONS,
                Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
            ],
            scopes: ['bot']
        })

        const inviteEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Invite')
            .setDescription(`You can invite the bot by clicking the button below!`);

        let inviteButton = new MessageButton()
            .setLabel('Invite')
            .setStyle('LINK')
            .setURL(invite)

        let deleteButton = new MessageButton()
            .setCustomId('deleteEmbed')
            .setLabel('🗑️')
            .setStyle('DANGER')

        const row = new MessageActionRow()
            .addComponents(
                inviteButton,
                deleteButton
            );

        await message.channel.send({ embeds: [inviteEmbed], components: [row] }).then(msg => {
            const deleteEmbedFilter = btn => btn.customId === 'deleteEmbed' && btn.user.id === message.author.id;
            const deleteEmbedCollector = msg.createMessageComponentCollector({ filter: deleteEmbedFilter, time: 20000 }); //10 seconds to use the button

            deleteEmbedCollector.on('collect', async i => {
                if (msg) msg.delete()
            })
        });

    }
}
