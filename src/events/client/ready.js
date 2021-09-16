const fs = require('fs');
const jsonfile = require('jsonfile');
const { prefix, statusDelay, statuses } = require("../../../config.json");

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
            setInterval(function() {
                
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

    let desc = client.commands.get(fileName).description
    let usage = client.commands.get(fileName).usage
    let alia = client.commands.get(fileName).aliases

    if (usage && alia) {
        dirs[dir.substring(1)][fileName] = {
            "Description": desc,
            "Usage": usage,
            "Aliases": alia
        }
    } else if (usage) {
        dirs[dir.substring(1)][fileName] = {
            "Description": desc,
            "Usage": usage
        }
    } else if (alia) {
        dirs[dir.substring(1)][fileName] = {
            "Description": desc,
            "Aliases": alia
        }
    } else {
    dirs[dir.substring(1)][fileName] = {
        "Description": desc
    }
    }

})
})
jsonfile.writeFileSync('./dirs.json', dirs, {
spaces: 2
})
}
module.exports = async (CLIENT, DISCORD) => {
    console.log('Bot is online!')

    client = CLIENT;
    Discord = DISCORD

    setStatuses()
    setHelp()            
}