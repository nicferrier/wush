const stream = require("stream");

module.exports = function (cl, env, stdin, stdout, stderr) {
    const [toMatch] = cl;
    let buffer = undefined;
    stdin.on("data", chunk => {
        const text = new String(chunk);
        const grepTarget =  buffer !== undefined ? buffer + text : text;
        buffer = undefined;
        const [lastLine, ...lines] = grepTarget.split("\n").reverse();
        buffer = grepTarget.endsWith("\n") ? undefined : lastLine + "\n";
        linesToMatch = grepTarget.endsWith("\n") ? lines : [lastLine].concat(lines);
        const matching = linesToMatch.reverse().filter(line => line.indexOf(toMatch) >= 0);
        matching.forEach(line => stdout.write(line + "\n"));
    });
    stdin.on("end", _ => {
        stdout.end();
        stderr.end();
    });
};


// End
