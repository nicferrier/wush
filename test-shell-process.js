const shell = require("./shell-process.js");
const stream = require("stream");
const path = require("path");
const fsfs = require("./fsfs.js");
const vfs = require("./fsvfs.js");

function getReadable() {
    const input = [
        "ls -la",
        "cd directory",
        "cd /home/nic",
        "ls -la",
        "cat a"
    ];
    const inputString = input.join("\n") + "\n";
    const rs = new stream.Readable();
    rs._read = () => {};
    rs.push(inputString);
    return rs;
}

function getOpts() {
    const testfs = new fsfs.FsFs(path.join(__dirname, "testfs"));
    const rootFs = new vfs.VFs({"/": testfs});
    return {
        root: rootFs,
        cwd: "/"
    };
}

shell.process(
    "wush", {}, getReadable(), process.stdout, process.stderr, getOpts()
);

