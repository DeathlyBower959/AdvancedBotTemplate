# Advanced Discord Bot Template

**This is a Discord.js bot using [discord.js](https://github.com/discordjs/discord.js) v13.**

# Installation
To begin with, you need [node.js](https://nodejs.org) installed on your system.

Once you have node.js installed, please continue.

- Clone this repository somewhere on your machine.
- Open a command prompt in the bots root directory
- Run `npm i`

# Bot Setup
- Go to the [Discord Dev](https://discord.com/developers/applications/) page
- If you haven't created a new application, then create one now. Otherwise, just open the application
- Go to the `Bot` tab on the left. If you haven't created a bot account yet, create one now, and then copy the token
- Rename the file `template.env` to `.env`
- Inside the `.env` file, change the token to your token: `token=TOKEN_THAT_YOU_COPIED_EARLIER`
- Open `config.json` and set the configs that you want
- Back on the [Discord Dev](https://discord.com/developers/applications/) page, scroll down and choose the permissions you want your bot to have
- Copy the `PERMISSIONS INTEGER`
- Paste the permissions integer into the `config.json`
- If all is well, then run `node .` or `node src/bot.js`

# Invite Bot
- Back at the [Discord Dev](https://discord.com/developers/applications/) page, click on your application and click `copy` under `Application ID`
- Then replace the hashtags in this link with your `Application ID` that you just copied <br>
```
https://discordapp.com/oauth2/authorize?client_id=############&scope=bot&permissions=8
```
- You can also use this [Discord Permissions Calculator](https://discordapi.com/permissions.html#0) and input your client id.

# Using The Code
*This is just a brief explanation of how the code works to help you better understand how I decided to structure the code.*

The `src` folder holds all the "code" for the discord bot. Outside of it is other extra stuff, like packages and configurations.

In the `commands` folder, you can create new "categories" by creating new folders. These folders have to start with a number, and the reason for this is so the folders get organized the way you want them to for the help command.

In each of the subfolders of the `commands` folder, you can hold the commands themselves. The filenames and the `name` value must be the same.

The subfolders mean that they will show up as a category in the help command.

In those subfolders, you can add more folders, which refer to `sub commands` of a the original command. I have a tempalte folder so you can see what I mean.

The `events` folder contains events that happen in discord, such as a message being sent, or a button being clicked.

The `handlers` folder contains files that are run as soon as the bot starts, and registers all the events and commands into collections to then be later retrieved.

`bot.js` is the entry file, runs all the handler files, and logs the bot in using the token

# Scripts
 - `npm run cooldown` : Calculates the amount of seconds to use as a cooldown in a given timeframe

# Code Templates

**New Command:**
```js
//Helpful Imports
require('module-alias/register')
const { runSubCmd, getAllSubCmds } = require('@utils/subCommands')
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: "FILE_NAME",
    description: "A description",
    
    aliases: [], //Optional (Defaults to none)
    botPerms: [], //Optional
    permissions: [], //Optional (Permissions for the user)
    usage: "", //Optional
    cooldown: 3, //Optional (Defaults to 0)
    subcommands: [require('./folder/subCmdFileName')],
    onlyDebug: true, //Optional (Defaults to false)
    async execute(message, args, cmd, client, Discord, prefix) {
  
        //Runs a subcommand
        if (runSubCmd(client.commands.get(cmd), args, { message: message, cmd: cmd, client: client, Discord: Discord, prefix: prefix }))
            return

      //Your code in here
  
    }
}
```

**New Sub Command**
```js
//Helpful Imports
require('module-alias/register')
const { runSubCmd, getAllSubCmds } = require('@utils/subCommands')
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
  name: "FILE_NAME",
  description: "A description",
    
    aliases: [], //Optional (Defaults to none)
    botPerms: [], //Optional
    permissions: [], //Optional (Permissions for the user)
    usage: "", //Optional
    cooldown: 3, //Optional (Defaults to 0)
    subcommands: [require('./folder/subCmdFileName')],
    onlyDebug: true, //Optional (Defaults to false)
  async execute(message, args, cmd, client, Discord, prefix, currentCmd, parentCommand, argsIndex) {

    if (runSubCmd(currentCmd, args, { message: message, cmd: cmd, client: client, Discord: Discord, prefix: prefix }, argsIndex))
      return

    //Your code here

  }
}

```

**New Button Collector:**
```js
let button1 = new MessageButton()
    .setCustomId('BUTTON_ID')
    .setLabel('Sample Button')
    .setStyle('PRIMARY')
    
const row = new MessageActionRow()
    .addComponents(
        button1
    );

await message.channel.send({ content: 'Sample', components: [row] }).then(msg => {
    const sampleFilter = btn => btn.customId === 'BUTTON_ID' && btn.user.id === message.author.id;
      const sampleFilterCollector = msg.createMessageComponentCollector({ filter: sampleFilter, time: 10000 }); //10 seconds to use the button

      sampleFilterCollector.on('collect', async i => {
        await i.update({ content: 'The button was clicked!', components: [row] })
      })

      sampleFilterCollector.on('end', async i => {
				await i.update({ content: `This interaction has timed out! Try running the command again`})
			})
});
```

**New Select Menu Collector:**
```js
let menu1 = new MessageSelectMenu()
    .setCustomId('SELECT_MENU_ID')
        .setPlaceholder('Nothing selected')
        .addOptions([{
                label: 'Option 1',
                description: 'A description',
                value: 'OPTION_ID',
            }
        ])
    
const row = new MessageActionRow()
    .addComponents(
        menu1
    );

await message.channel.send({ content: 'Sample', components: [row] }).then(msg => {
    const sampleFilter = menu => menu.customId === 'SELECT_MENU_ID' && menu.user.id === message.author.id;
      const sampleFilterCollector = msg.createMessageComponentCollector({ filter: sampleFilter, time: 10000 }); //10 seconds to use the button

      sampleFilterCollector.on('collect', async i => {
        await i.update({ content: `Select Menu Option ID: ${i.value}`, components: [row] })
      })

      sampleFilterCollector.on('end', async i => {
				await i.update({ content: `This interaction has timed out! Try running the command again`})
			})
});
```

<hr>

**MessageButton**
```js
const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('primary')
        .setLabel('Primary')
        .setStyle('PRIMARY'),
    );
```

**MessageSelectMenu**
```js
const row = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId('SELECT_MENU_ID')
        .setPlaceholder('Nothing selected')
        .addOptions([{
                label: 'Option 1',
                description: 'A description',
                value: 'OPTION_ID',
            }
        ])
    );
```


# Important Links
- [Discord.js Documentation](https://discord.js.org/#/docs)
- [Discord.js Server](https://discord.gg/bRCvFy9)

# Author
- Discord: [DeathlyBower959 [YT]#2561](https://discordapp.com/users/689284642184101970)
- YouTube: <https://www.youtube.com/channel/DeathlyBower959>
