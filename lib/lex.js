module.exports = {

    line: 0,
    i: 0,

    types: {
        ERROR: -1,
        WORD: 0,
        SYMBOL: 1,
        OPERATOR: 2,
        NUMBER: 3,
        STRING: 4,
        OBJECT: 5,
        PROPERTY: 6,
        INLINE_JS: 7
    },

    lex: function(input) {
        this.line = 1;
        this.i = 0;

        var tokens = [];

        while (this.i < input.length) {
            this.skipWhiteSpace(input);

            // skip comments
            if (input[this.i] == '#') {
                while (input[this.i] != '\n') {
                    this.i++;
                }
                continue;
            }

            // inline javascript
            if (input.indexOf('~~~', this.i) == this.i) {
                tokens.push(this.lexInlineJs(input));
            }
        }

        return tokens;
    },

    lexInlineJs: function(input) {
        // anything between two sets of '~~~'
        this.i += 3;
        var start = this.i;
        var next = input.indexOf('~~~', this.i);

        // is this an invalid inline js segment?
        if (next == -1) {
            this.i = input.length;
            return this.token(this.types.ERROR, 'Unterminated inline JavaScript segment starting on line ' + this.line);
        }

        // just eat the js code and copy it, emit it as one possibly giant token
        while (this.i != next) {
            if (input[this.i] == '\n') {
                this.line++;
            }
            this.i++;
        }

        var tok = this.token(this.types.INLINE_JS, input.substring(start, this.i));
        this.i += 3;
        return tok;
    },

    skipWhiteSpace: function(input) {
        var cur = input[this.i];
        while (cur == ' ' || cur == '\r' || cur == '\n' || cur == '\v' || cur == '\t') {
            if (cur == '\n') {
                this.line++;
            }
            cur = input[++this.i];
        }
    },

    token: function(type, val, line) {
        return {type: type, value: val || '', line: line || this.line};
    }
}
