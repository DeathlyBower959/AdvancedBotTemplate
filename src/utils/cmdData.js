//Converts seconds into a more readable time format
const secondsToDhms = (seconds) => {
    if (!seconds) return
    seconds = Number(seconds);
    let w = Math.floor(seconds % ((3600 * 24) * 7) / 3600);
    let d = Math.floor(seconds % (3600 * 24) / 3600);
    let h = Math.floor(seconds % (3600 * 24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);

    let wDisplay = w > 0 ? w + 'w, ' : "";
    let dDisplay = d > 0 ? d + 'd, ' : "";
    let hDisplay = h > 0 ? h + 'h, ' : "";
    let mDisplay = m > 0 ? m + 'm, ' : "";
    let sDisplay = s > 0 ? s + 's' : "";

    return wDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
}

//Returns an object with data about a command (client.commands.get('cmdName')) 
const getCmdData = (cmd) => {
    const fileName = cmd.cmd.name
    const desc = cmd.cmd.description
    const usage = cmd.cmd.usage
    const aliases = cmd.cmd.aliases?.map(x => `${x} `)
    const cooldown = secondsToDhms(cmd.cmd.cooldown)
    const subCommands = cmd.subcmds?.map(x => `\`${x.cmd.name}\``)
    const parentDirectory = cmd.parentDir

    return {
        name: fileName,
        description: desc,
        usage: usage,
        aliases: aliases,
        cooldown: cooldown,
        subCommands: subCommands,
        parentDir: parentDirectory
    }
}

module.exports = { getCmdData, secondsToDhms }