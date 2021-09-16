# Advanced Discord Bot Template

**This is a Discord.js bot using [discord.js](https://github.com/discordjs/discord.js) v13.**

# Installation
To begin with, you need [node.js](https://nodejs.org) installed on your system.

Once you have node.js installed continue.

- Clone this repository somewhere on your machine.
- Open a command prompt in the bots root directory
- Run `npm install`

# Bot Setup
- Go to the [Discord Dev](https://discord.com/developers/applications/) page
- If you haven't created an application, then create one now, if you already have just click it
- Go to the `Bot` tab on the left, if you haven't created one, create one now, and then copy the token
- First create a new file named `.env`
- Inside the file put the text
```
token=TOKEN_THAT_YOU_COPIED_EARLIER
```
- Open `config.json` and set the configs that you want
- If all is well, then run `node .` or `node src/bot.js`

# Invite Bot
- Back at the [Discord Dev](https://discord.com/developers/applications/) page, click on your application and click `copy` under `Application ID`
- Then replace the hastags in this link with your `Application ID` that you just copied <br>
`https://discordapp.com/oauth2/authorize?client_id=############&scope=bot&permissions=8`

# Important Links
- [Discord.js Documentation](https://discord.js.org/#/docs)
- [Discord.js server](https://discord.gg/bRCvFy9)

# Using The Code
*This is just a brief explanation of how to code works, to help you better understand how I decided to structure the code.*

The `src` folder holds all the "code" for the discord bot. Outside of it is other extra stuff, like packages and configurations.

In the `commands` folder, you can create new "categories" by creating new folders. These folders have to start with a number, and the reason for this is so the folders get organized the way you want them to.

In each of the subfolders in the `commands` folder, is where you hold the commands themselves. The filenames and the `name` value must be the same.

The `events` folder contains events that happen in discord, such as a message being sent, or a button being clicked. The subfolders have no significance, just for organization.

The `handlers` folder contains files that are run as soon as the bot starts, and registers all the events, commands, and interactions into collections, to then be later retrieved.

The `interactions` folder contains 2 subfolders, `buttons` and `select_menus`. Each of them have sub categories, for organization. When a button is clicked, or a select menu is triggered, it gets the id of the button/select menu and runs the corresponding event in the interactions folder, which has the same id.

The `error.js` files in the interactions folder is only for when a button/select menu is triggered, but there is no matching id. It sends a message to the user and writes to the console.

`bot.js` is the file that is run on startup, runs all the handler files, and logs the bot in using the token

The `dirs.json` is for the help command, and allows it to show all of your commands, without you manually updating it.


**New Command:**
```js
module.exports = {
    name: "FILE_NAME",
    description: "A description",
    
    aliases: [], //Optional (Defaults to none)
    usage: "", //Optional
    cooldown: 3, //Optional (Defaults to 0)
    onlyDebug: true, //Optional (Defaults to false)
    async execute(message, args, cmd, client, Discord, prefix) {
  
      //Your code in here
  
    }
  }
```

**New Button Interaction:**
```js
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
	id: "sample",
	async execute(interaction) {
		
		//Your code in here
		
		interaction.deferUpdate();
		return;
	},
};
```

**New Select Menu Interaction:**
```js
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
	id: "sample",
	async execute(interaction) {
		const selectedItem = interaction.values[0];
		const selectedItems = interaction.values;
		
		//Your code here
		
		interaction.deferUpdate();
		return;
	},
};
```

# Author
- Discord: DeathlyBower959 [YT]#2561
- YouTube: <https://www.youtube.com/channel/DeathlyBower959>
