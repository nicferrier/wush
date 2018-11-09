const path = require("path");
const redirectFs = require("./fsredirectfs.js");
const fsFs = require("./fsfs.js");
const vfs = require("./fsvfs.js");

const mountPoints = {
    "/": new fsFs.FsFs(path.join(__dirname, "testfs")),
    "/home/nic": new redirectFs.RedirectFsFs("/home/nicferrier", "/home/nic")
}

const testfs = new vfs.VFs(mountPoints);
const stream = testfs.open("/home/nic/emacs");
stream.pipe(process.stdout);

// End
