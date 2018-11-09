const filesystem = require("./fsfs.js");
const fs = require("fs");
const path = require("path");

class RedirectFsFs extends filesystem.FsFs {
    constructor(baseDir, mountDir) {
        super(baseDir);
        this.mountPoint = mountDir;
    }

    _join(pathToJoin) {
        const [_, rebasedPath]
              = new RegExp(this.mountPoint + "(/.*)")
              .exec(pathToJoin);
        console.log("rebasedPath", rebasedPath);
        return path.join(this.baseDir, rebasedPath);
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
    RedirectFsFs
};

// End
