const lineSplit = require("./shell-lines.js");
const assert = require("assert");

function test () {
    const [check1, test1] = lineSplit("ls -la");
    assert.deepStrictEqual(test1, ["ls", "-la"]);

    const [check2, test2] = lineSplit("echo \"hello there\"");
    assert.deepStrictEqual(test2, ["echo", new lineSplit.QuotedString("hello there")]);

    const [check3, test3] = lineSplit("echo \"hello there \\\"again\\\"\"");
    assert.deepStrictEqual(test3, ["echo", new lineSplit.QuotedString("hello there \\\"again\\\"")]);

    const [check4, test4] = lineSplit("[ $value -gt 0 ] && echo \"hello\"");
    assert.deepStrictEqual(test4, [
        "[", "$value", "-gt", "0", "]",
        "&&",
        "echo", new lineSplit.QuotedString("hello")
    ]);
}

test()

// End
