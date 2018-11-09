const base = require("./basefs.js");
const mounts = require("./mounts.js");
const path = require("path");

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

module.exports = {
    VFs
};

// End
