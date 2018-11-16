const shellSplit = require("shell-lines");

class ShellProcess {
    constructor(commandLine, environment) {
        this.commandLine = commandLine;
        this.environment = environment;
    }

    process(lines) {
        lines.forEach(line => {
            const [check, words] = shellSplit(line);
        });
    }
}

function shellProcess(cl, env, stdin, stdout, stderr) {
    let buffer = undefined;
    const process = new ShellProcess(cl, env);
    stdin.on("data", chunk => {
        const text = new String(chunk);
        const shellStream =  buffer !== undefined ? buffer + text : text;
        buffer = undefined;
        const [lastLine, ...lines] = shellStream.split("\n").reverse();
        process.process(lines);
    });
}


// End
