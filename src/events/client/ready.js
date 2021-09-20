const fs = require('fs');
const jsonfile = require('jsonfile');
const { prefix, statusDelay, statuses } = require("../../../config.json");
const { subcommands } = require('../../commands/1Sample/select');


let client, Discord

const setStatuses = async () => {
    const validStatuses = [
        "PLAYING",
        "STREAMING",
        "LISTENING",
        "WATCHING",
        "COMPETING"
    ]

    statuses.forEach(item => {
        if (!validStatuses.includes(item.type.toUpperCase())) console.log(`Invalid Status: ${item.type}`)
    })

    if (statuses.length > 0) {
        let guildCount = client.guilds.cache.size;
        let guildCountText = `${guildCount} guild`
        if (guildCount > 1) {
            guildCountText = `${guildCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} guilds`
        }

        client.user.setActivity(
            statuses[0].content
                .replace("{prefix}", prefix)
                .replace("{guildCount}", guildCount)
                .replace("{guildCountText}", guildCountText), {
            type: statuses[0].type.toUpperCase()
        });

        let index = 0;
        setInterval(function () {

            //Gets replacable variables
            guildCount = client.guilds.cache.size;

            //Gets selected status
            var status = statuses[index].content
                .replace("{prefix}", prefix)
                .replace("{guildCount}", guildCount)
                .replace("{guildCountText}", guildCountText)

            client.user.setActivity(status, {
                type: statuses[index].type.toUpperCase()
            });

            index++;
            if (index == statuses.length) index = 0

        }, statusDelay * 1000); //Convert to milliseconds
    }
}

const getAllSubCmds = (cmd) => {
    let subCmds = [];
    if (cmd.subcommandsDir && cmd.subcommands) {
        cmd.subcommands.forEach(item => {
            let cmdObject = { cmd: item }
            const cmdSubCmds = getAllSubCmds(cmd.subcommands)
            if (cmdSubCmds != null)
                cmdObject = cmdSubCmds

            subCmds.push(cmdObject)
        })
        return subCmds
    }

    return null;
}

const setHelp = async () => {
    // Help commands
    var dirs = {}

    const commandDirs = fs
        .readdirSync('src/commands')
        .filter(dir => fs.lstatSync(`src/commands/${dir}`).isDirectory())

    commandDirs.forEach(dir => {
        //Creates new empty object for each directory
        dirs[dir.substring(1)] = {}

        const dirCmds = fs.readdirSync(`src/commands/${dir}`).filter(file => file.endsWith('.js'))
        dirCmds.forEach(file => {
            let fileName = file.split('.')[0]

            const retreivedCmd = client.commands.get(fileName)?.cmd

            let desc = retreivedCmd?.description
            let usage = retreivedCmd?.usage
            let alia = retreivedCmd?.aliases
            let subCmds = client.commands.get(fileName)?.subcmds

            let pushObject = {}

            if (desc) pushObject["Description"] = desc
            if (usage) pushObject["Usage"] = usage
            if (alia) pushObject["Aliases"] = alia
            if (subCmds) pushObject["SubCommands"] = subCmds

            dirs[dir.substring(1)][fileName] = pushObject

        })
    })
    jsonfile.writeFileSync('./dirs.json', dirs, {
        spaces: 2
    })
}
module.exports = async (CLIENT, DISCORD) => {
    console.log('Bot is online!')

    client = CLIENT
    Discord = DISCORD

    setStatuses()
    setHelp()
}