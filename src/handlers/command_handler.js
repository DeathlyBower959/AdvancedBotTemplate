const fs = require('fs')
const ascii = require("ascii-table");

module.exports = (client, Discord) => {
    let tables = []
    const load_dir = (dir) => {
        try {
            let table = new ascii(dir == '' ? "Commands" : dir);
            table.setHeading("Command", "Load status");
            
            const command_files = fs
                .readdirSync(`src/commands/${dir}`)
                .filter(file => file.endsWith('.js'));

            for (const file of command_files) {
                const command = require(`../commands/${dir}/${file}`);
                if (command.name) {
                    client.commands.set(command.name, command);
                    table.addRow(command.name, "🟢 Loaded");
                } else {
                    table.addRow(file, "🔴 No command name!");
                    continue;
                }
            }
            if (table.getRows().length > 0)
                tables.push(table.toString().cyan)
        } catch (e) {
            console.log(String(e.stack));
        }
    }

    //Load Files that arent in a sub folder
    load_dir('')

    const command_dirs = fs
        .readdirSync('src/commands')
        .filter(dir => fs.lstatSync(`src/commands/${dir}`).isDirectory())

    command_dirs.forEach(x => load_dir(x))
    client.consoleLogs.push({
        key: "Commands",
        value: tables
    })
}