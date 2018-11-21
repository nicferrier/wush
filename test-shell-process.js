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

async function test() {
    const value = await new Promise((resolve, reject) => {
        let buffer = "";
        const out = new stream.Writable({
            write(chunk, encoding, next) {
                buffer = buffer + chunk;
                next();
            },
            
            final(callback) {
                resolve(buffer);
            }

        });
        shell.process(
            "wush", {}, getReadable(), out, process.stderr, getOpts()
        );
    });
    console.log("value >>>", value, "<<<");
}

test();

// End
