require('module-alias/register')


const fs = require('fs');
const ascii = require("ascii-table");

module.exports = (client, Discord) => {
    let tables = []
	const load_dir = (dir) => {
        try {
            let table = new ascii(dir == '' ? "Commands" : dir);
            table.setHeading("Event", "Load status");

            const event_files = fs
                .readdirSync(`src/events/${dir}`)
                .filter(file => file.endsWith('.js'))

            for (const file of event_files) {
                const event = require(`@events/${dir}/${file}`);
                const event_name = file.split('.')[0]

                if (event) {
                    client.on(event_name, event.bind(null, client, Discord))
                    table.addRow(event_name, "🟢 Listening");
                } else {
                    table.addRow(file, "🔴 Error");
                    continue;
                }
            }
            if (table.getRows().length > 0)
                tables.push(table.toString().yellow)
        } catch (e) {
            console.log(String(e.stack).red);
        }
    }

    load_dir('')

    const eventDirs = fs
		.readdirSync('src/events')
		.filter(dir => fs.lstatSync(`src/events/${dir}`).isDirectory());

    //console.log(`\n>--------Events--------<`)
	eventDirs.forEach(e => load_dir(e))
    client.consoleLogs.push({
        key: "Events",
        value: tables
    })
}