require('module-alias/register')
const { runSubCmd, getAllSubCmds } = require('@utils/subCommands')

const fs = require('fs')
const ascii = require("ascii-table");

module.exports = (client, Discord) => {
    let tables = []

    const load_dir = (dir) => {
        try {
            let table = new ascii(dir == '' ? "Slash Commands" : dir);
            table.setHeading("Command", "Load status");

            const command_files = fs
                .readdirSync(`src/slashCommands/${dir}`)
                .filter(file => file.endsWith('.js'));

            for (const file of command_files) {
                const command = require(`../slashCommands/${dir}/${file}`);
                if (command.name) {
                    let cmdObject = { cmd: command, parentDir: dir };
                    if (command.subcommands) {
                        cmdObject.subcmds = getAllSubCmds(command)
                    }
                    client.slashCommands.set(command.name, cmdObject);
                    table.addRow(command.name, "🟢 Loaded");
                } else {
                    table.addRow(file, "🔴 No command name!");
                    continue;
                }
            }
            if (table.getRows().length > 0)
                tables.push(table.toString().cyan)
        } catch (e) {
            console.log((e.stack).toString());
        }
    }


    //Load Files that arent in a sub folder
    load_dir('')

    const command_dirs = fs
        .readdirSync('src/slashCommands')
        .filter(dir => fs.lstatSync(`src/slashCommands/${dir}`).isDirectory())

    command_dirs.forEach(x => load_dir(x))
    client.consoleLogs.push({
        key: "Slash Commands",
        value: tables
    })
}