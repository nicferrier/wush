// A wush file system based on node's fs module -*- js-indent-level: 4 -*-

const base = require("./fsbasefs.js");
const path = require("path");
const stream = require("stream");

const fs = require("fs");

class FsFs extends base.Fs {
    constructor(baseDir) {
        super();
        this.baseDir = baseDir;
    }

    _resolve(pathToJoin) {
        return path.join(this.baseDir, pathToJoin);
    }

    access(path, mode) {
        const realPath = this._resolve(path);
        try {
            const access = fs.accessSync(realPath, fs.constants.R_OK);
            return 0;
        }
        catch (e) {
            // console.log("path", realPath, e);
            return -1;
        }
    }

    getattr(path) {
    }

    readdir(path) {
        const p = fs.promises.readdir(this._resolve(path));
        let dirListBuffer = undefined;
        return new stream.Readable({
            async read(size) {
                if (dirListBuffer === undefined) {
                    const dirList = await p;
                    dirListBuffer = dirList.join("\n") + "\n";
                }
                const required = dirListBuffer.substring(0, size);
                dirListBuffer = dirListBuffer.substring(size - 1);
                // console.log("required", required, ">", dirListBuffer, "<", dirListBuffer.length);
                this.push(required);
            }
        });
    }

    readlink(path) {
    }
    
    open(path, flags) {
        console.log("fsfs path", path);
        return fs.createReadStream(this._resolve(path)); // FIXME no flags!
    }
}

module.exports = {
    FsFs
};

// End
