const fs = require('fs');
const ascii = require("ascii-table");
const botMain = require('../bot')

module.exports = (client, Discord) => {
    let tables = []
    const load_dir = (dir) => {
        try {
            let table = new ascii(dir == '' ? "Buttons" : dir);
            table.setHeading("ButtonID", "Load status");

            const button_files = fs
                .readdirSync(`src/interactions/buttons/${dir}`)
                .filter(file => file.endsWith(".js"));

            for (const file of button_files) {
                const interaction = require(`../interactions/buttons/${dir}/${file}`);
                if (interaction.id) {
                    client.buttonCommands.set(interaction.id, interaction);
                    table.addRow(interaction.id, "🟢 Loaded");
                } else {
                    table.addRow(file, "🔴 No ID");
                    continue;
                }
            }
            if (table.getRows().length > 0)
                tables.push(table.toString().green)
        } catch (e) {
            console.log(String(e.stack));
        }
    }

    load_dir('')

    const buttonDirs = fs
        .readdirSync("src/interactions/buttons")
        .filter(dir => fs.lstatSync(`src/interactions/buttons/${dir}`).isDirectory())

    buttonDirs.forEach(dir => load_dir(dir))
    client.consoleLogs.push({
        key: "Buttons",
        value: tables
    })
}