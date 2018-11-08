// A lot of this was nicked from https://www.stavros.io/posts/python-fuse-filesystem/
const path = require("path");

class Stat {
}

class FsStat {
}

class FsError {  // can this extend exception?
}

const FsErrors = {
    EACCES: -1
};

class Fs {
    constructor() {
    }

    access(path, mode) {
        throw new FsError(FsErrors.EACCES);
    }

    chmod(path, mode) {
    }

    chown(path, uid, gid) {
    }

    getattr(path) {
        // This is the Python
        // return dict(
        //  (key, getattr(st, key)) for key in (
        //       'st_atime',
        //       'st_ctime',
        //       'st_gid',
        //       'st_mode',
        //       'st_mtime', 'st_nlink', 'st_size', 'st_uid'))

        return new Stat();
    }

    readdir(path) {
    }

    readlink(path) {
    }

    mknod(path, mode, dev) {
    }

    rmdir(path) {
    }

    mkdir(path, mode) {
    }

    statfs(path) {
        // Python 
        //  stv = os.statvfs(full_path)
        //  return dict((key, getattr(stv, key)) for key in (
        //    'f_bavail',
        //    'f_bfree',
        //    'f_blocks',
        //    'f_bsize',
        //    'f_favail',
        //    'f_ffree',
        //    'f_files',
        //    'f_flag',
        //    'f_frsize',
        //    'f_namemax'))
        return new FsStat();
    }

    unlink(path) {
    }

    symlink(name, target) {
    }

    rename(oldName, newName) {
    }

    link(target, name) {
    }

    utimens(path, times) { // time = None in the python
    }

    open(path, flags) {
    }

    create(path, mode, fi) {  // fi = None in the python
    }

    truncate(self, path, length, fh) { // fh = None in the python
    }

    flush(path, fh) {
    }

    release(path, fh) {
    }

    fsync(path, fdatasync, fh) {
    }
}

class FsFs extends Fs {
    constructor(baseDir) {
        super();
        this.baseDir = baseDir;
    }

    _join(path) {
        return path.join(this.baseDir, path);
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
        return fs.createReadStream(this._join(path)); // FIXME no flags!
    }
}

const mounts = {
    "/": new FsFs(path.join(__dirname, "testfs")),
    "/home/nic": new FsFs("/home/nicferrier")
}

class TopFs extends Fs {
    constructor(mounts) {
        super();
        this.mounts = mounts;
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
        const impl = this.mounts[path];
        return impl.open(path, flags);
    }
}

function matchMount (path, mounts) {
    const candidates = Object.keys(mounts).filter(mountPath => new RegExp("^" + mountPath).exec(path) );
    const matched = candidates.slice().sort().reverse()[0];
    return mounts[matched];
}

console.log(matchMount("/home/nic/bin/mypackage/one/two", {
    "/": 1,
    "/home/nic/bin/mypackage": 10,
    "/home/nic": 2,
    "/home/dan": 3
}));

// End
