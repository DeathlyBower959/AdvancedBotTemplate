const jsonfile = require('jsonfile');
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
  name: "help",
  description: "Lists all avaliable bot commands",
  aliases: ['h'],
  cooldown: 5,
  async execute(message, args, cmd, client, Discord, prefix, profileData) {

    const dirs = await jsonfile.readFileSync('./dirs.json')

    //Constructing Embed

    let pages = []

    let page = 1

    let dirNames = []

    const helpEmbed = new Discord.MessageEmbed() //Create new embed
      .setColor("RED") //Embed Color

    let dirIndex = 0

    //Loop through command directories
    Object.keys(dirs).forEach((dirName) => {

      dirNames.push(dirName)
      pages[dirIndex] = "\n\n"

      //Loop through all commands in specified directory
      Object.keys(dirs[dirName]).forEach((fileName) => {
        
        var desc = client.commands.get(fileName).description
        var usage = client.commands.get(fileName).usage
        var alia = client.commands.get(fileName).aliases

        if (usage && alia) {
          pages[dirIndex] += `\n**${prefix}${fileName}**\nDescription: ${desc}\nUsage: ${usage}\nAliases: ${alia}\n`
        } else if (usage) {
          pages[dirIndex] += `\n**${prefix}${fileName}**\nDescription: ${desc}\nUsage: ${usage}\n`
        } else if (alia) {
          pages[dirIndex] += `\n**${prefix}${fileName}**\nDescription: ${desc}\nAliases: ${alia}\n`
        } else {
          pages[dirIndex] += `\n**${prefix}${fileName}**\nDescription: ${desc}\n`
        }

      })
      dirIndex++
    })

    helpEmbed.setTitle('Help Page - ' + dirNames[0]) //Embed Title
    helpEmbed.setDescription(pages[page - 1]) //Sets desc as default page
    helpEmbed.setFooter(`Page ${page} of ${pages.length}`) //Showing page location


    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setCustomId('firstPage')
      .setLabel('◀️')
      .setStyle('PRIMARY'),

      new MessageButton()
      .setCustomId('backPage')
      .setLabel('⬅️')
      .setStyle('PRIMARY'),

      new MessageButton()
      .setCustomId('forwardPage')
      .setLabel('➡️')
      .setStyle('PRIMARY'),

      new MessageButton()
      .setCustomId('lastPage')
      .setLabel('▶️')
      .setStyle('PRIMARY'),

      new MessageButton()
      .setCustomId('deleteEmbed')
      .setLabel('🗑️')
      .setStyle('DANGER'),
    );

    let sentEmbed;

    await message.channel.send({embeds: [helpEmbed], ephemeral: true, components: [row]}).then(msg => {

      sentEmbed = msg.embeds[0]
      
    })
  }
}