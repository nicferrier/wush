// A wush fs that allows redirecting a file system  -*- js-indent-level: 4 -*-

const filesystem = require("./fsfs.js");
const fs = require("fs");
const path = require("path");

class RedirectFsFs extends filesystem.FsFs {
    constructor(baseDir, mountDir) {
        super(baseDir);
        this.mountPoint = mountDir;
    }

    _resolve(pathToJoin) {
        const [_, rebasedPath]
              = new RegExp(this.mountPoint + "(/.*)")
              .exec(pathToJoin);
        console.log("rebasedPath", rebasedPath);
        return path.join(this.baseDir, rebasedPath);
    }
}

module.exports = {
    RedirectFsFs
};

// End
