//Helpful Imports
require('module-alias/register')

const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "button",
    description: "A sample Button command",
    cooldown: 0, // Optional
    onlyDebug: true,
    async execute(message, args, cmd, client, Discord, prefix) {

        let button1 = new MessageButton()
            .setCustomId('sample')
            .setLabel('Sample Button')
            .setStyle('PRIMARY')

        const row = new MessageActionRow()
            .addComponents(
                button1
            );

        let interactionTime = 20000; //Milliseconds

        await message.channel.send({ content: 'Sample', components: [row] }).then(msg => {

            setTimeout(() => {
                msg.edit('Interaction timed out!');
                setTimeout(() => {
                    if (msg) msg.delete();
                }, 1000)
            }, interactionTime)
            const sampleFilter = btn => btn.customId === 'sample' && btn.user.id === message.author.id;
            const sampleFilterCollector = msg.createMessageComponentCollector({ filter: sampleFilter, time: interactionTime }); //10 seconds to use the button

            sampleFilterCollector.on('collect', async i => {
                await i.update({ content: 'The button was clicked!', components: [row] })
            })
        });

    }
}
