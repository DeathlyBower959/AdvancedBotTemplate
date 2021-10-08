//Helpful Imports
require('module-alias/register')


const { prefix, statusDelay, statuses } = require('@root/config.json');


let client, Discord

const setStatuses = async () => {
    const validStatuses = [
        "PLAYING",
        "WATCHING",
        "LISTENING",
        "STREAMING",
        "COMPETING"
    ]

    statuses.forEach(item => {
        if (!validStatuses.includes(item.type.toUpperCase())) console.log(`Invalid Status: ${item.type}`)
    })

    if (statuses.length > 0) {
        //Gets replacable variables
        let guildCount = 0;
        let userCount = 0;
        let guildCountText
        let userCountText
        client.guilds.cache.forEach((guild) => {
            guildCount++
            userCount += guild.memberCount - 1 //Removes the bot so its an accurate memeber count
        });

        guildCountText = `${guildCount} guild`
        if (guildCount > 1) {
            guildCountText = `${guildCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} guilds`
        }

        userCountText = `${userCount} user`
        if (userCount > 1) {
            userCountText = `${userCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} users`
        }

        client.user.setActivity(
            statuses[0].content
                .replace("{prefix}", prefix)
                .replace("{guildCount}", guildCount)
                .replace("{guildCountText}", guildCountText)
                .replace("{userCount}", userCount)
                .replace("{userCountText}", userCountText)
                .replace("{s}", `${userCount > 1 ? "s" : ""}`), {
            type: statuses[0].type.toUpperCase()
        });

        let index = 0;
        setInterval(function () {

            //Gets replacable variables
            guildCount = 0;
            userCount = 0;
            client.guilds.cache.forEach((guild) => {
                guildCount++
                userCount += guild.memberCount - 1 //Removes the bot so its an accurate memeber count
            });

            guildCountText = `${guildCount} guild`
            if (guildCount > 1) {
                guildCountText = `${guildCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} guilds`
            }

            userCountText = `${userCount} user`
            if (userCount > 1) {
                userCountText = `${userCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} users`
            }

            //Gets selected status
            var status = statuses[index].content
                .replace("{prefix}", prefix)
                .replace("{guildCount}", guildCount)
                .replace("{guildCountText}", guildCountText)
                .replace("{userCount}", userCount)
                .replace("{s}", `${userCount > 1 ? "s" : ""}`)

            client.user.setActivity(status, {
                type: statuses[index].type.toUpperCase()
            });

            index++;
            if (index == statuses.length) index = 0

        }, statusDelay * 1000); //Convert to milliseconds
    }
}

module.exports = async (CLIENT, DISCORD) => {
    console.log('Bot is online!')

    client = CLIENT
    Discord = DISCORD

    setStatuses()
}