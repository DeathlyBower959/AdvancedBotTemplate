//Helpful Imports
require('module-alias/register')

const { MessageButton, MessageActionRow, Permissions, MessageEmbed} = require('discord.js');

module.exports = {
    name: "invite",
    description: "Gets the bots invite link",
    cooldown: 5, // Optional
    async execute(message, args, cmd, client, Discord, prefix) {

        const invite = await client.generateInvite({ // You can edit these permissions to change what perms your bot needs
            permissions: [
                Permissions.FLAGS.ADMINISTRATOR,

                Permissions.FLAGS.ADD_REACTIONS,
                Permissions.FLAGS.ATTACH_FILES,
                Permissions.FLAGS.BAN_MEMBERS,
                Permissions.FLAGS.CHANGE_NICKNAME,
                Permissions.FLAGS.CONNECT,
                Permissions.FLAGS.CREATE_INSTANT_INVITE,
                Permissions.FLAGS.DEAFEN_MEMBERS,
                Permissions.FLAGS.EMBED_LINKS,
                Permissions.FLAGS.KICK_MEMBERS,
                Permissions.FLAGS.MANAGE_CHANNELS,
                Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS,
                Permissions.FLAGS.MANAGE_GUILD,
                Permissions.FLAGS.MANAGE_MESSAGES,
                Permissions.FLAGS.MANAGE_NICKNAMES,
                Permissions.FLAGS.MANAGE_ROLES,
                Permissions.FLAGS.MANAGE_THREADS,
                Permissions.FLAGS.MANAGE_WEBHOOKS,
                Permissions.FLAGS.MENTION_EVERYONE,
                Permissions.FLAGS.MOVE_MEMBERS,
                Permissions.FLAGS.MUTE_MEMBERS,
                Permissions.FLAGS.PRIORITY_SPEAKER,
                Permissions.FLAGS.READ_MESSAGE_HISTORY,
                Permissions.FLAGS.REQUEST_TO_SPEAK,
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.SEND_TTS_MESSAGES,
                Permissions.FLAGS.SPEAK,
                Permissions.FLAGS.STREAM,
                Permissions.FLAGS.USE_APPLICATION_COMMANDS,,
                Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
                Permissions.FLAGS.USE_EXTERNAL_STICKERS,
                Permissions.FLAGS.USE_PRIVATE_THREADS,
                Permissions.FLAGS.USE_PUBLIC_THREADS,
                Permissions.FLAGS.USE_VAD,
                Permissions.FLAGS.VIEW_AUDIT_LOG,
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.VIEW_GUILD_INSIGHTS
            ],
            scopes: ['bot', 'applications.commands']
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
