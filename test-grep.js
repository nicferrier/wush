const fs = require("fs");
const assert = require("assert");
const stream = require("stream");
const grep = require("./grep.js");

const test = async function () {
    const stdin = fs.createReadStream("grep-infile");
    const result = await new Promise((resolve, reject) => {
        const outBuf = [];
        class BufferWritable extends stream.Writable {
            constructor(options) { super(options) }

            _write(chunk, encoding, callback) {
                const str = new String(chunk);
                const eol = str.indexOf("\n");
                if (eol) {
                    outBuf.push(str.substring(0,eol));
                }
                callback();
            }

            _final(callback) {
                resolve(outBuf);
                callback();
            }
        }
        grep(["hello"], {}, stdin, new BufferWritable(), new BufferWritable());
    });

    assert.deepStrictEqual(
        result,
        ['eventually it says hello and that should match',
         'but lines that say hello definitely will']
    );
}

test().then();


// End
