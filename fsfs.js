const base = require("./basefs.js");
const path = require("path");

const fs = require("fs");

class FsFs extends base.Fs {
    constructor(baseDir) {
        super();
        this.baseDir = baseDir;
    }

    _join(pathToJoin) {
        return path.join(this.baseDir, pathToJoin);
    }

    access(path, mode) {
    }

    getattr(path) {
    }

    readdir(path) {
    }

    readlink(path) {
    }

    open(path, flags) {
        console.log("fsfs path", path);
        return fs.createReadStream(this._join(path)); // FIXME no flags!
    }
}

module.exports = {
    FsFs
};

// End
