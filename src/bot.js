const fs = require("fs");
const Discord = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
const jsonfile = require('jsonfile');
const colors = require("colors");
require('dotenv').config()

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
});

client.commands = new Collection();
client.buttonInteractions = new Collection();
client.selectInteractions = new Collection();
client.slashCommands = new Collection();

client.consoleLogs = []

const handlerFiles = fs
    .readdirSync('src/handlers')
    .filter(file => file.endsWith(".js"));

handlerFiles.forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

client.login(process.env.token)

//Logging Handler Setups
console.log("\n>--------------".gray)
console.log("> Started Loading Files".gray)
let previousKey;
client.consoleLogs.forEach(item => {
    if (previousKey == item.key) {
        item.value.forEach(table => {
            console.log(`${table}`)
        })
    } else {
        console.log("\n>-------".gray + item.key.toString().white + "-------<\n".gray)
        item.value.forEach(table => {
            console.log(`${table}`)
        })
    }
    previousKey = item.key;
})
console.log("\n> Completed Loading Files".gray)
console.log(">--------------\n".gray)