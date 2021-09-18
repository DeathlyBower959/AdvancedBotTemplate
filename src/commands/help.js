const jsonfile = require('jsonfile');
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
  name: "help",
  description: "Lists all avaliable bot commands",
  aliases: ['h'],
  cooldown: 0,
  async execute(message, args, cmd, client, Discord, prefix) {

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
    helpEmbed.setDescription(pages[0]) //Sets desc as default page
    helpEmbed.setFooter(`Page ${page} of ${pages.length}`) //Showing page location


    const firstPgBtn = new MessageButton()
      .setCustomId('firstPage')
      .setLabel('⏮️')
      .setStyle('PRIMARY')
      .setDisabled(true)

    const backPgBtn = new MessageButton()
      .setCustomId('backPage')
      .setLabel('◀️')
      .setStyle('PRIMARY')
      .setDisabled(true)

    const forwardPgBtn = new MessageButton()
      .setCustomId('forwardPage')
      .setLabel('▶️')
      .setStyle('PRIMARY')

    const lastPgBtn = new MessageButton()
      .setCustomId('lastPage')
      .setLabel('⏭️')
      .setStyle('PRIMARY')

    const deletePgBtn = new MessageButton()
      .setCustomId('deleteEmbed')
      .setLabel('🗑️')
      .setStyle('DANGER')

    let row = new MessageActionRow()
      .addComponents(
        firstPgBtn,
        backPgBtn,
        forwardPgBtn,
        lastPgBtn,
        deletePgBtn
      );

    async function updateBtnVisibility(pg) {
      if (pg === 1) {
        firstPgBtn.setDisabled(true)
        backPgBtn.setDisabled(true)
        forwardPgBtn.setDisabled(false)
        lastPgBtn.setDisabled(false)
      } else if (pg === pages.length) {
        firstPgBtn.setDisabled(false)
        backPgBtn.setDisabled(false)
        forwardPgBtn.setDisabled(true)
        lastPgBtn.setDisabled(true)
      } else {
        firstPgBtn.setDisabled(false)
        backPgBtn.setDisabled(false)
        forwardPgBtn.setDisabled(false)
        lastPgBtn.setDisabled(false)
      }
      row = new MessageActionRow()
        .addComponents(
          firstPgBtn,
          backPgBtn,
          forwardPgBtn,
          lastPgBtn,
          deletePgBtn
        );
    }

    await message.channel.send({ embeds: [helpEmbed], components: [row] }).then(msg => {

      const firstPageFilter = btn => btn.customId === 'firstPage' && btn.user.id === message.author.id;
      const firstPageCollector = msg.createMessageComponentCollector({ filter: firstPageFilter, time: 60000 });

      const backPageFilter = btn => btn.customId === 'backPage' && btn.user.id === message.author.id;
      const backPageCollector = msg.createMessageComponentCollector({ filter: backPageFilter, time: 60000 });

      const forwardPageFilter = btn => btn.customId === 'forwardPage' && btn.user.id === message.author.id;
      const forwardPageCollector = msg.createMessageComponentCollector({ filter: forwardPageFilter, time: 60000 });

      const lastPageFilter = btn => btn.customId === 'lastPage' && btn.user.id === message.author.id;
      const lastPageCollector = msg.createMessageComponentCollector({ filter: lastPageFilter, time: 60000 });

      const deleteEmbedFilter = btn => btn.customId === 'deleteEmbed' && btn.user.id === message.author.id;
      const deleteEmbedCollector = msg.createMessageComponentCollector({ filter: deleteEmbedFilter, time: 60000 });

      firstPageCollector.on('collect', async i => {
        await updateBtnVisibility(1)
        if (page === 1) {
          i.deferUpdate()
          return;
        } //Make sure on the first page, and return so you cant go back.
        page = 1;
        helpEmbed.setTitle(dirNames[0]);
        helpEmbed.setDescription(pages[0]);
        helpEmbed.setFooter(`Page ${page} of ${pages.length}`);
        await i.update({ embeds: [helpEmbed], components: [row] })
      })

      backPageCollector.on('collect', async i => {
        await updateBtnVisibility(page-1)
        if (page === 1) {
          i.deferUpdate()
          return;
        } //Make sure on the first page, and return so you cant go back.
        page--; //If it can go back, move back a page number
        helpEmbed.setTitle(dirNames[page - 1]);
        helpEmbed.setDescription(pages[page - 1]);
        helpEmbed.setFooter(`Page ${page} of ${pages.length}`);
        await i.update({ embeds: [helpEmbed], components: [row] })
      })

      forwardPageCollector.on('collect', async i => {
        await updateBtnVisibility(page+1)
        if (page === pages.length) {
          i.deferUpdate()
          return;
        } //Make sure on the last page, and return so you cant go forward.
        page++; //If it can go forward, move forward a page number
        helpEmbed.setTitle(dirNames[page - 1]);
        helpEmbed.setDescription(pages[page - 1]);
        helpEmbed.setFooter(`Page ${page} of ${pages.length}`);
        await i.update({ embeds: [helpEmbed], components: [row] })
      })

      lastPageCollector.on('collect', async i => {
        await updateBtnVisibility(pages.length)
        if (page === pages.length) {
          i.deferUpdate()
          return;
        } //Make sure on the last page, and return so you cant go forward.
        page = pages.length
        helpEmbed.setTitle(dirNames[page - 1]);
        helpEmbed.setDescription(pages[page - 1]);
        helpEmbed.setFooter(`Page ${page} of ${pages.length}`);
        await i.update({ embeds: [helpEmbed], components: [row] })
      })

      deleteEmbedCollector.on('collect', async i => {
        if (msg) msg.delete()
      })

    })
  }
}

