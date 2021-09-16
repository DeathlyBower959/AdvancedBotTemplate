const fs = require('fs');
const { MessageActionRow, MessageButton } = require('discord.js');
const { owner } = require("../../../config.json");

module.exports = async (client, Discord, interaction) => {

    if (interaction.isSelectMenu()) {
        let selectInteraction = client.selectInteractions.get(interaction.customId)
        
        if (!selectInteraction) {
            const errorSelectInteraction = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Error...")
            .setDescription(`Sorry, the select menu you just used caused an error!\n\nTry contacting <@${owner}> about it!`)
            interaction.channel.send({embeds: [errorSelectInteraction], ephemeral: true}).then(msg => {
                setTimeout(function() {
                    if (msg) msg.delete();
                }, 5000)
            })
            selectInteraction = client.selectInteractions.get("error")
        }
        
        selectInteraction.execute(interaction);
    } 
    else if (interaction.isButton()) {

        
        let buttonInteraction = client.buttonInteractions.get(interaction.customId)
        
        if (!buttonInteraction) {
            const errorButtonInteraction = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Error...")
            .setDescription(`Sorry, the button you just clicked caused an error!\n\nTry contacting <@${owner}> about it!`)
            interaction.channel.send({embeds: [errorButtonInteraction], ephemeral: true}).then(msg => {
                setTimeout(function() {
                    if (msg) msg.delete();
                }, 5000)
            })
            buttonInteraction = client.buttonInteractions.get("error")
        }
        
        buttonInteraction.execute(interaction);
    }
    else {
        console.log("Interaction not handled: " + interaction.customId)
    }
}