const fs = require('fs');
const jsonfile = require('jsonfile');
const { prefix, invite } = require("../../../config.json");

module.exports = async (client, Discord) => {
    console.log('Bot is online!')
    client.user.setActivity(`${prefix}help | ${invite}`, {
    type: 'PLAYING'
    });

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