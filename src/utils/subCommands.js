const runSubCmd = (command, args, dataObject, startIndex) => {
    let argsIndex = 0;
    if (startIndex) argsIndex = startIndex
    const findSubCmd = (cmd) => {
        let subCmd
        if (cmd.subcmds) {
            subCmd = cmd.subcmds?.find(cmd => cmd.cmd.name.toLowerCase() == args[argsIndex]?.toLowerCase() || cmd.cmd.aliases?.find(alias => alias.toLowerCase() == args[argsIndex]?.toLowerCase()))
            argsIndex++

            if (subCmd)
                return subCmd
            else
                return null
        }

        return null;
    }

    const subCmd = findSubCmd(command)
    //const subCmd = client.commands.get(cmd).subcmds.find(x => x.cmd.name.toLowerCase() == args[0]?.toString().toLowerCase())?.cmd
    if (subCmd) {
        subCmd.cmd?.execute(dataObject.message, args, dataObject.cmd, dataObject.client, dataObject.Discord, dataObject.prefix, subCmd, command, argsIndex)
        return true;
    }
}

const getAllSubCmds = (cmd) => {
    let subCmds = []
    if (cmd.subcommands) {
        cmd.subcommands.forEach(item => {
            let cmdObject = { cmd: item }
            const cmdSubCmds = getAllSubCmds(item)
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

module.exports = { runSubCmd, getAllSubCmds }