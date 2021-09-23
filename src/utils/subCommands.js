const runSubCmd = (command, args, dataObject, startIndex) => {
    let argsIndex = 0;
    if (startIndex) argsIndex = startIndex
    const findSubCmd = (cmd) => {
        let subCmd
        if (cmd.subcmds) {
            subCmd = cmd.subcmds?.find(x => x.cmd.name.toLowerCase() == args[argsIndex]?.toLowerCase())
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

module.exports = { runSubCmd }