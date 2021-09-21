var args = process.argv.slice(2);

const WdhmsToSeconds = () => {
    let weeks = 0;
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    args.forEach(arg => {
        if (arg.endsWith('w')) weeks = Number(arg.substring(0, arg.length - 1))
        if (arg.endsWith('d')) days = Number(arg.substring(0, arg.length - 1))
        if (arg.endsWith('h')) hours = Number(arg.substring(0, arg.length - 1))
        if (arg.endsWith('m')) minutes = Number(arg.substring(0, arg.length - 1))
        if (arg.endsWith('s')) seconds = Number(arg.substring(0, arg.length - 1))
    })

    seconds += weeks * ((3600 * 24) * 7);
    seconds += days * (3600 * 24);
    seconds += hours * 3600;
    seconds += minutes * 60;

    return seconds
}

const chk = (args) => {
    let check = true;
    args.forEach(arg => {
        if (!(arg.endsWith('w') || arg.endsWith('d') || arg.endsWith('h') || arg.endsWith('m') || arg.endsWith('s'))) {
            check = false
            return
        }
    })

    return check
}

if (args.length > 0 && args.length <= 5 && chk(args)) {
    const seconds = WdhmsToSeconds(args);
    console.log(`${(Math.round(seconds * 100) / 100).toLocaleString()} seconds`)
    console.log(`Copy: ${seconds}`)
} else {
    console.log('Please specify a time frame!\n"1w 2d 3h 4m 5s"')
}