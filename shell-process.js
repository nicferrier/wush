const shellSplit = require("./shell-lines.js");
const stream = require("stream");
const path = require("path");

const builtIns = {
    "cd": function (args, env, opts) {
        const {root, cwd} = opts;
        const [directory, ...rest] = args;
        const target = path.join(cwd, directory);
        const error = root.access(target);
        if (error != 0) {
            opts.stderr.write(`no such directory: ${directory}\n`);
            return error;
        }
        env.pwd = target;
        opts.cwd = target;
        return 0;
    },

    "ls": function (args, env, opts) {
        const {root, cwd, stdout} = opts;
        console.log("ls", cwd);
        root.readdir(cwd).pipe(stdout);  // what data do we need?
        return 0;
    },

    "cat": function (args, env, opts) {
        const {root, cwd, stdout} = opts;
        console.log("cat", args, cwd);
        args.forEach(relativeFile => {
            // probably should check it's not something else
            const filename = path.join(cwd, relativeFile);
            /// probably should access check
            root.open(filename).pipe(stdout);
        });
        return 0;
    },

    "grep": function (args, env, opts) {
        console.log("grep!");
        return 0;
    }
}

const reservedWords = Object.keys(builtIns);

class ShellProcess {
    constructor(commandLine, environment, opts) {
        this.commandLine = commandLine;
        this.environment = environment;
        this.stdin = opts.stdin;
        this.stdout = opts.stdout;
        this.stderr = opts.stderr;
        this.root = opts.root;
        this.cwd = opts.cwd;
    }

    process(lines) {
        lines.forEach(line => {
            const [check, words] = shellSplit(line);
            const [firstWord, ...wordRest] = words;

            if (reservedWords.indexOf(firstWord) > -1) {
                const func = builtIns[firstWord];
                const commandOpts = {
                    stdin: this.stdin,
                    stdout: this.stdout,
                    stderr: this.stderr,
                    root: this.root,
                    cwd: this.cwd
                }
                const result = func(wordRest, this.environment, commandOpts);
                if (result == 0) {
                    this.cwd = commandOpts.cwd;
                }
                // console.log(firstWord, wordRest, result, this.cwd);
            }
            else {
                console.log("exe search", firstWord);
            }
        });
    }
}

exports.process = function(cl, env, stdin, stdout, stderr, opts) {
    let buffer = undefined;
    opts.stderr = stderr;
    opts.stdout = stdout;
    const process = new ShellProcess(cl, env, opts);
    stdin.on("data", chunk => {
        const text = new String(chunk);
        const shellStream =  buffer !== undefined ? buffer + text : text;
        buffer = undefined;
        const [lastLine, ...lines] = shellStream.split("\n").reverse();
        process.process(lines.reverse());
    });
}

// End
