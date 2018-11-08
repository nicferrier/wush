const path = require("path");

exports.match = function(path, mounts) {
    const candidates = Object.keys(mounts).filter(mountPath => new RegExp("^" + mountPath).exec(path) );
    const matched = candidates.slice().sort().reverse()[0];
    return mounts[matched];
};

// End

