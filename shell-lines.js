
const InString = 2;
const InWord = 4;
const EOL = 8;
const SOL = 16;

class QuotedString {
    constructor(init) {
        this.value = init;
    }

    concat(str) {
        this.value = this.value + str;
    }

    valueOf() {
        return this.value;
    }
}

function charSplit(i, line, words, state) {
    if (i == line.length) {
        return EOL;
    }

    const lastChar = i == 0 ? SOL : line[i - 1];
    const ch = line[i];
    // console.log("ch", ch, i, state & InString, ch == ' ');

    if (state & InString) {
        if (ch == '"' && line[i - 1] != '\\') {
            // String ends
            return charSplit(++i, line, words, state ^ InString);
        }
        else {
            const quotedStr = words[words.length - 1];
            quotedStr.concat(ch);
            return charSplit(++i, line, words, state);
        }
    }
    
    if (ch == ' ') {
        // skip whitespace
        return charSplit(++i, line, words, state ^ InWord);
    }
    
    if (ch == '"') {
        words.push(new QuotedString(""));
        return charSplit(++i, line, words, state ^ InString);
    }

    if (lastChar == SOL || lastChar == ' ') {
        words.push("");
    }

    words[words.length - 1] = words[words.length - 1] + ch;
    return charSplit(++i, line, words, state | InWord);
}

module.exports = function (line) {
    const words = [];
    const check = charSplit(0, line, words, 0);
    return [check, words];
};

module.exports.QuotedString = QuotedString;

// End
