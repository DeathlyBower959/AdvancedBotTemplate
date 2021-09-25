//Helpful Imports
require('module-alias/register')
const { getCmdData } = require('@utils/cmdData')

const { MessageButton, MessageActionRow } = require('discord.js');
const fs = require('fs')

module.exports = {
    name: "help",
    description: "Lists all avaliable bot commands",
    aliases: ['h'],
    cooldown: 3,
    permissions: ['administrator'],
    async execute(message, args, cmd, client, Discord, prefix) {

        //Array that holds text for each embed page (Not fields becus lazy)
        let embedPages = []
         
        //Current Embed Page Index
        let currentPage = 1

        //The Directory Names 
        let folderNames = fs
            .readdirSync('src/commands')
            .filter(dir => fs.lstatSync(`src/commands/${dir}`).isDirectory())

        folderNames.forEach((item, index) => {
            if (!isNaN(parseInt(item[0])))
                folderNames[index] = item.split('_').join(' ').substring(1, item.length) //Remove the numbers at the beginning of the folder names
        })

        //Embed setup
        let currentPageIndex = 0

        const helpEmbed = new Discord.MessageEmbed() //Create new embed
            .setColor("RED") //Embed Color


        //Gets every single sub command for a command (client.commands.get('cmdName'))
        const getSubCmds = (cmd) => {
            let subCmds = []
            if (cmd.subcmds) {
                cmd.subcmds.forEach(item => {
                    let cmdObject = item
                    const cmdSubCmds = getSubCmds(item)
                    if (cmdSubCmds != null)
                        cmdObject.subcmds = cmdSubCmds

                    subCmds.push(cmdObject)
                })
                if (subCmds.length > 0)
                    return subCmds
                else
                    return null
            }

            return null;
        }


        const findSubCmd = (cmd, arg) => {
            return cmd?.subcmds?.find(cmd => cmd.cmd.name.toLowerCase() == arg.toLowerCase())
        }

        let retreivedCommands = []
        if (args?.length > 0) {
            //Getting a command
            if (client.commands.get(args[0])) retreivedCommands.push(client.commands.get(args[0]))

            //Looping through the args
            for (let i = 0; i < args.length; i++) {
                const cmd = findSubCmd(retreivedCommands[i - 1], args[i])
                if (cmd) retreivedCommands.push(cmd)
            }
        }

        //Means that we found the sub command
        if (retreivedCommands.length > 0) {


            const cmdData = getCmdData(retreivedCommands[retreivedCommands.length - 1])

            let tempPrefix = prefix;

            for (let i = 0; i < retreivedCommands.length - 1; i++) {
                tempPrefix += retreivedCommands[i].cmd.name ? retreivedCommands[i].cmd.name + ' ' : ''
            }

            const fileName = cmdData?.name
            const desc = cmdData?.description
            const usage = cmdData?.usage
            const aliases = cmdData?.aliases
            const cooldown = cmdData?.cooldown
            const subCommands = cmdData?.subCommands

            folderNames = [fileName]

            let textToAdd = `\n**${tempPrefix}${fileName}**`

            if (desc) textToAdd += `\nDescription: ${desc}`
            if (usage) textToAdd += `\nUsage: ${usage}`
            if (aliases) textToAdd += `\nAliases: ${aliases}`
            if (cooldown) textToAdd += `\nCooldown: ${cooldown}`
            if (subCommands) textToAdd += `\nSubcommands: ${subCommands}`

            embedPages = ["\n"] //Makes it so when creating new item it doesnt start off undefined

            embedPages[0] += `${textToAdd}\n`
        } else {


            //Used for knowing when to create a new embed page
            let previousParentDirectory = ''

            //One time boolean to check if we are on the first page
            let firstPage = true

            //For every single command
            client.commands.forEach(cmd => {
                const cmdData = getCmdData(cmd)

                if (cmdData?.parentDir == '') return //Excludes commands not in a sub directory

                const parentDirectory = cmdData?.parentDir
                const fileName = cmdData?.name
                const desc = cmdData?.description
                const usage = cmdData?.usage
                const aliases = cmdData?.aliases
                const cooldown = cmdData?.cooldown
                const subCommands = cmdData?.subCommands

                let textToAdd = `\n**${prefix}${fileName}**`

                if (desc) textToAdd += `\nDescription: ${desc}`
                if (usage) textToAdd += `\nUsage: ${usage}`
                if (aliases) textToAdd += `\nAliases: ${aliases}`
                if (cooldown) textToAdd += `\nCooldown: ${cooldown}`
                if (subCommands) textToAdd += `\nSubcommands: ${subCommands}`

                if (previousParentDirectory != parentDirectory) {
                    if (!firstPage) currentPageIndex++
                    embedPages[currentPageIndex] = "\n" //Makes it so when creating new item it doesnt start off undefined
                }

                embedPages[currentPageIndex] += `${textToAdd}\n`

                firstPage = false

                previousParentDirectory = parentDirectory;
            })

        }


        //Checks whether we found a single command, or multiple sub commands
        const embedTitlePrefix = retreivedCommands.length > 0 ? (retreivedCommands.length > 1 ? "Help Subcommand" : "Help Command") : "Help Page"

        helpEmbed.setTitle(`${embedTitlePrefix} - ${folderNames[0]}`) //Embed Title
        helpEmbed.setDescription(embedPages[0]) //Sets desc as default page
        helpEmbed.setFooter(`Page ${currentPage} of ${embedPages.length}  •  Requested By: ${message.author.username}`) //Showing page location

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

        if (embedPages.length == 1) {
            firstPgBtn.setDisabled(true)
            backPgBtn.setDisabled(true)
            forwardPgBtn.setDisabled(true)
            lastPgBtn.setDisabled(true)
        }

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
            } else if (pg === embedPages.length) {
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
                if (currentPage === 1) {
                    i.deferUpdate()
                    return;
                } //Make sure on the first page, and return so you cant go back.
                currentPage = 1;
                helpEmbed.setTitle(`${embedTitlePrefix} - ${folderNames[0]}`) //Embed Title
                helpEmbed.setDescription(embedPages[0]);
                helpEmbed.setFooter(`Page ${currentPage} of ${embedPages.length}  •  Requested By: ${message.author.username}`);
                await i.update({ embeds: [helpEmbed], components: [row] })
            })

            backPageCollector.on('collect', async i => {
                await updateBtnVisibility(currentPage - 1)
                if (currentPage === 1) {
                    i.deferUpdate()
                    return;
                } //Make sure on the first page, and return so you cant go back.
                currentPage--; //If it can go back, move back a page number
                helpEmbed.setTitle(`${embedTitlePrefix} - ${folderNames[currentPage - 1]}`) //Embed Title
                helpEmbed.setDescription(embedPages[currentPage - 1]);
                helpEmbed.setFooter(`Page ${currentPage} of ${embedPages.length}  •  Requested By: ${message.author.username}`);
                await i.update({ embeds: [helpEmbed], components: [row] })
            })

            forwardPageCollector.on('collect', async i => {
                await updateBtnVisibility(currentPage + 1)
                if (currentPage === embedPages.length) {
                    i.deferUpdate()
                    return;
                } //Make sure on the last page, and return so you cant go forward.
                currentPage++; //If it can go forward, move forward a page number
                helpEmbed.setTitle(`${embedTitlePrefix} - ${folderNames[currentPage - 1]}`) //Embed Title
                helpEmbed.setDescription(embedPages[currentPage - 1]);
                helpEmbed.setFooter(`Page ${currentPage} of ${embedPages.length}  •  Requested By: ${message.author.username}`);
                await i.update({ embeds: [helpEmbed], components: [row] })
            })

            lastPageCollector.on('collect', async i => {
                await updateBtnVisibility(embedPages.length)
                if (currentPage === embedPages.length) {
                    i.deferUpdate()
                    return;
                } //Make sure on the last page, and return so you cant go forward.
                currentPage = embedPages.length
                helpEmbed.setTitle(`${embedTitlePrefix} - ${folderNames[currentPage - 1]}`) //Embed Title
                helpEmbed.setDescription(embedPages[currentPage - 1]);
                helpEmbed.setFooter(`Page ${currentPage} of ${embedPages.length}  •  Requested By: ${message.author.username}`);
                await i.update({ embeds: [helpEmbed], components: [row] })
            })

            deleteEmbedCollector.on('collect', async i => {
                if (msg) msg.delete()
            })

        })
    }
}

