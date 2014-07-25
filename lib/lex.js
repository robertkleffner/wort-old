module.exports = {

    line: 0,
    i: 0,
    input: '',

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
        this.input = input;
        this.line = 1;
        this.i = 0;

        var tokens = [];

        while (this.i < this.input.length) {
            this.skipWhiteSpace();

            // skip comments
            if (this.currentIs('#')) {
                while (!this.currentIs('\n')) {
                    this.next();
                }
                continue;
            }

            // inline javascript
            if (this.sequence('~~~')) {
                tokens.push(this.lexInlineJs(input));
                continue;
            }

            // object literals
            if (this.currentIs('{')) {
                tokens.push(this.lexObjectLiteral(input));
                continue;
            }

            // bad token, gotta quit!
            if (this.i < this.input.length) {
                this.i = this.input.length;
                tokens.push(this.token(this.types.ERROR, 'Unrecognized token start'));
            }
        }

        return tokens;
    },

    lexInlineJs: function() {
        // anything between two sets of '~~~'
        this.next(3);
        var start = this.i;
        var next = this.input.indexOf('~~~', this.i);

        // is this an invalid inline js segment?
        if (next == -1) {
            this.i = this.input.length;
            return this.token(this.types.ERROR, 'Unterminated inline JavaScript segment');
        }

        // just eat the js code
        this.next(next - this.i);
        // and copy it, emit it as one possibly giant token
        var tok = this.token(this.types.INLINE_JS, this.input.substring(start, this.i));

        this.next(3);
        return tok;
    },

    lexObjectLiteral: function() {
        var start = this.i;
        var nest = 1;
        this.next();

        // allows for defining objects with nested objects as properties
        while (nest != 0 && this.i < this.input.length) {
            if (this.currentIs('}')) {
                nest--;
            } else if (this.currentIs('{')) {
                nest++;
            }
            this.next();
        }

        if (nest != 0) {
            return this.token(this.types.ERROR, 'Unterminated object literal');
        } else {
            return this.token(this.types.OBJECT, this.input.substring(start, this.i));
        }
    },

    skipWhiteSpace: function() {
        // keep this as a fast but ugly utility method
        var cur = this.input[this.i];
        while (cur == ' ' || cur == '\r' || cur == '\n' || cur == '\v' || cur == '\t') {
            if (cur == '\n') {
                this.line++;
            }
            cur = this.input[++this.i];
        }
    },

    // utility functions to make lexing code more readable
    token: function(type, val, line) {
        return {type: type, value: val || '', line: line || this.line};
    },

    next: function(amount) {
        var add = this.i + (amount || 1);
        for (; this.i < add; this.i++) {
            if (this.input[this.i] == '\n') {
                this.line++;
            }
        }
    },

    currentIs: function(char) {
        return this.input[this.i] == char;
    },

    current: function() {
        return this.input[this.i];
    },

    sequence: function(val) {
        return this.input.indexOf(val, this.i) == this.i;
    }
}
