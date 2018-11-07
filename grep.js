const fs = require("fs");

const grep = function (cl, env, stdin, stdout, stderr) {
    const [toMatch] = cl;
    let buffer = undefined;
    stdin.on("data", chunk => {
        const text = new String(chunk);
        const grepTarget =  buffer !== undefined ? buffer + text : text;
        buffer = undefined;
        const [lastLine, ...lines] = grepTarget.split("\n").reverse();
        buffer = grepTarget.endsWith("\n") ? undefined : lastLine + "\n";
        const matching = lines.reverse().filter(line => line.indexOf(toMatch) >= 0);
        matching.forEach(line => stdout.write(line + "\n"));
    });
};


const callGrep = function () {
    const stdin = fs.createReadStream("grep-infile");
    grep(["hello"], {}, stdin, process.stdout, process.stderr);
}


callGrep();

// End
