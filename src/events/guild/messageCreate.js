const { prefix, owner } = require("../../../config.json");

//Require Permissions From Discord.js instead of Discord.Permissions
const { Permissions, DiscordAPIError } = require('discord.js')

//Cooldown Map
const cooldowns = new Map();

//Array of allowed permissions
let validPermissions = []

for (const perm of Object.keys(Permissions.FLAGS)) {
    validPermissions.push(perm)
}

module.exports = async (client, Discord, message) => {
    if (message.author.bot) return;

    //Check if message mentions bot only
    if (message.content === `<@!${message.client.user.id}>` || message.content === `<@${message.client.user.id}>`) {
        if (message) message.delete();
        const forgotPrefixEmbed = new Discord.MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Oops!")
            .setDescription(`Looks like you forgot the prefix! \nMy prefix is \`${prefix}\``)
        return message.channel.send({ embeds: [forgotPrefixEmbed] }).then(msg => {
            setTimeout(function () {
                if (msg) msg.delete()
            }, 8000)
        });
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd))
    if (command) {
        if (command.onlyDebug && message.author.id != owner) {
            const onlyDebugEmbed = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle("Sorry!")
                .setDescription(`You can't use this command!`)
            return message.channel.send({ embeds: [onlyDebugEmbed] }).then(msg => {
                setTimeout(function () {
                    if (msg) msg.delete()
                }, 8000)
            });
        }
    }

    if (!message.content.startsWith(prefix) || !command) return;

    if (message) message.delete();

    //Bot Perms
    let missingPerms = [];
    let requiredPerms = [];
    if (command.botPerms) {
        requiredPerms = command.botPerms;
    }
    requiredPerms.push(validPermissions[validPermissions.indexOf("SEND_MESSAGES")]);
    requiredPerms.push(validPermissions[validPermissions.indexOf("EMBED_LINKS")]);
    requiredPerms.push(validPermissions[validPermissions.indexOf("USE_EXTERNAL_EMOJIS")]);
    requiredPerms.push(validPermissions[validPermissions.indexOf("READ_MESSAGE_HISTORY")]);

    for (const perm of requiredPerms) {
        if (!validPermissions.includes(perm)) {
            return console.log(`Invalid Permission ${perm} in ${command.name}`)
        }
        if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
            missingPerms.push(perm)
        }
    }
    if (missingPerms.length) {
        const missingPermsEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Error")
            .setDescription(`Sorry, there was an error running that command! I am missing the permission[s]\n${missingPerms.map(p => `\`${p}\``).join(", ")}`)


        return message.author.send({ embeds: [missingPermsEmbed] })
    }

    //User Perms
    if (command.permissions) {
        let missingPerms = []
        for (const perm of command.permissions) {
            if (!validPermissions.includes(perm)) {
                return console.log(`Invalid Permission ${perm} in ${command.name}`)
            }
            if (!message.member.hasPermission(perm)) {
                missingPerms.push(perm)
            }
        }
        if (missingPerms.length) {
            const missingPermsEmbed = new Discord.MessageEmbed()
                .setColor("RED")
                .setTitle("Error")
                .setDescription(`Sorry you are missing these permission[s]\n${missingPerms.map(p => `\`${p}\``).join(", ")}`)

            return message.channel.send({ embeds: [missingPermsEmbed] }).then(msg => {
                setTimeout(function () {
                    if (msg) msg.delete()
                }, 15000)
            });
        }
    }

    // Cooldown
    if (command.cooldown) {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection())
        }

        const current_time = Date.now()
        const time_stamps = cooldowns.get(command.name)
        const cooldown_amount = (command.cooldown) * 1000

        if (time_stamps.has(message.author.id)) {
            const expiration_time = time_stamps.get(message.author.id) + cooldown_amount

            if (current_time < expiration_time) {
                const time_left = (expiration_time - current_time) / 1000

                const cooldownEmbed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription("")
                    .setTitle("Slow Down!")

                if (time_left.toFixed(1) >= 3600) {
                    let hour = (time_left / 3600).toFixed(1);
                    cooldownEmbed.setDescription(`Sorry your on cooldown for ${hour} more hour[s]!`)
                } else if (time_left.toFixed(1) >= 60) {
                    let minute = (time_left / 60).toFixed(1);
                    cooldownEmbed.setDescription(`Sorry your on cooldown for ${minute} more minute[s]!`)
                } else {

                    let seconds = time_left.toFixed(1);
                    cooldownEmbed.setDescription(`Sorry your on cooldown for ${seconds} more second[s]!`)
                }


                return message.channel.send({ embeds: [cooldownEmbed] }).then(msg => {
                    setTimeout(function () {
                        if (msg) msg.delete()
                    }, 5000)
                });
            }
        }

        time_stamps.set(message.author.id, current_time)
        setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount)

    }

    try {
        command.execute(message, args, cmd, client, Discord, prefix);
    } catch (err) {
        console.log(err);
        console.log(`Guild: ${message.guild.name}\nChannel: "${message.channel.name}"\nMessage: ${message.content}\nCommand: "${cmd}"`)
        const errorRunCmd = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Error")
            .setDescription(`Sorry there was an error running that command!\n\`\`\`err\n${err}\n\`\`\``)
        await message.channel.send({ embeds: [errorRunCmd] }).then(msg => {
            setTimeout(function () {
                if (msg) msg.delete()
            }, 4000)
        });
    }

}