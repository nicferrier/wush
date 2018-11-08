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

class RedirectFsFs extends FsFs {
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

const mounts = require("./mounts.js");

// top-level virtual FS that deals with understanding mount points
class VFs extends base.Fs {
    constructor(mounts) {
        super();
        this.mounts = mounts;
    }

    access(path, mode) {
        const impl = mounts.match(path, this.mounts);
        return impl.access(path, mode);
    }

    getattr(path) {
        const impl = mounts.match(path, this.mounts);
        return impl.getattr(path);
    }

    readdir(path) {
        const impl = mounts.match(path, this.mounts);
        return impl.readdir(path);
    }

    readlink(path) {
        const impl = mounts.match(path, this.mounts);
        return impl.readlink(path);
    }

    open(path, flags) {
        const impl = mounts.match(path, this.mounts);
        return impl.open(path, flags);
    }
}

const mountPoints = {
    "/": new FsFs(path.join(__dirname, "testfs")),
    "/home/nic": new RedirectFsFs("/home/nicferrier", "/home/nic")
}

const testfs = new VFs(mountPoints);
const stream = testfs.open("/home/nic/emacs");
stream.pipe(process.stdout);


// End
