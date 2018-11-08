const mounts = require("./mounts.js");
const assert = require("assert");

function test () {
    const found = mounts.match("/home/nic/bin/mypackage/one/two", {
        "/": 1,
        "/home/nic/bin/mypackage": 10,
        "/home/nic": 2,
        "/home/dan": 3
    });
    assert.deepStrictEqual(10, found);
}

test();

// End
