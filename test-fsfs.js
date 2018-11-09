const fsfs = require("./fsfs.js");
const path = require("path");
const assert = require("assert");

async function test() {
    const testfs = new fsfs.FsFs(path.join(__dirname, "testfs"));
    const data = await new Promise((resolve, reject) => {
        const dirFile = testfs.readdir("/");
        const aBit = dirFile.on("data", chunk => {
            resolve(new String(chunk).valueOf());
        });
    });
    assert.deepStrictEqual("bin\nhome\n", data);
}

test().then();

// End
