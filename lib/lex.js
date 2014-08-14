var XRegExp = require('xregexp').XRegExp;

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
        INLINE_JS: 7,
        BUILT_IN: 8,
        SHUFFLE: 9
    },

    syntax: [';', ':', '[', ']'],

    operators: [
        // arithmetic operators
        '+', '-', '*', '/', '%', '++', '--',
        // bitwise operators
        '~', '&', '|', '^', '<<', '>>', '>>>',
        // logical operators
        '&&', '||', '!',
        // comparison operators
        '=', '!=', '==', '!==', '<', '<=', '>', '>=',
        // object access operators
        '->', '<-', '@'
    ],

    lex: function(input) {
        this.input = input;
        this.line = 1;
        this.i = 0;

        var tokens = [];

        while (!this.eof()) {
            this.skipWhiteSpace();
            if (this.eof()) { break; }

            // skip comments
            if (this.currentIs('#')) {
                while (!this.currentIs('\n')) {
                    this.next();
                }
            }

            // inline javascript
            else if (this.sequence('~~~')) {
                tokens.push(this.lexInlineJs());
            }

            // object literals
            else if (this.currentIs('{')) {
                tokens.push(this.lexObjectLiteral());
            }

            // stack shuffle sequence
            else if (this.currentIs('(')) {
                tokens.push(this.lexStackShuffle());
            }

            // object property modification syntax
            else if ((this.sequence('->') || this.sequence('<-')) && this.validIdStart(this.peek(2))) {
                tokens.push(this.lexObjectModifier());
            }

            // object property read syntax
            else if (this.currentIs('@') && this.validIdStart(this.peek())) {
                tokens.push(this.lexObjectRead());
            }

            // string literals
            else if (this.currentIs('"')) {
                tokens.push(this.lexString());
            }

            // number literals
            else if (this.validNumberStart()) {
                tokens.push(this.lexNumber());
            }

            // symbols
            else if (this.isSymbol(this.current())) {
                tokens.push(this.lexSymbol());
            }

            // operators
            else if (!this.validIdStart(this.current())) {
                tokens.push(this.lexOperator());
            }

            // identifiers
            else {
                tokens.push(this.lexIdentifier());
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
        while (nest != 0 && !this.eof()) {
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

    lexStackShuffle: function() {
        this.next();
        var start = this.i;

        while (!this.eof() && this.validShuffle(this.current())) {
            this.next();
        }

        if (this.eof() || !this.currentIs('-')) {
            return this.token(this.types.ERROR, 'Invalid stack shuffle, must have two parts separated by "-"');
        }
        this.next();

        while (!this.eof() && this.validShuffle(this.current())) {
            this.next();
        }

        if (this.eof() || !this.currentIs(')')) {
            return this.token(this.types.ERROR, 'Unterminated stack shuffle sequence');
        }

        var tok = this.token(this.types.SHUFFLE, this.input.substring(start, this.i));
        this.next();
        return tok;
    },

    lexObjectModifier: function() {
        var start = this.i;
        this.next(2);

        while (!this.eof() && this.validIdentifier(this.current())) {
            this.next();
        }

        return this.token(this.types.PROPERTY, this.input.substring(start, this.i));
    },

    lexObjectRead: function() {
        var start = this.i;
        this.next();

        while (!this.eof() && this.validIdentifier(this.current())) {
            this.next();
        }

        return this.token(this.types.PROPERTY, this.input.substring(start, this.i));
    },

    lexString: function() {
        var start = this.i;
        this.next();
        while (!this.currentIs('"')) {
            if (this.currentIs('\\')) {
                this.next();
            }
            this.next();

            if (this.eof()) {
                return this.token(this.types.ERROR, 'Unterminated string literal');
            }
        }
        this.next();
        return this.token(this.types.STRING, this.input.substring(start, this.i));
    },

    lexNumber: function() {
        var start = this.i;
        this.next();
        while (!this.eof() && this.validNumber(this.current())) {
            this.next();
        }
        return this.token(this.types.NUMBER, this.input.substring(start, this.i));
    },

    lexSymbol: function() {
        this.next();
        return this.token(this.types.SYMBOL, this.input.substring(this.i-1, this.i));
    },

    lexOperator: function() {
        var longest = '';
        for (var i = 0; i < this.operators.length; i++) {
            if (this.sequence(this.operators[i])) {
                if (this.operators[i].length > longest.length) {
                    longest = this.operators[i];
                }
            }
        }

        if (longest == '') {
            this.i = this.input.length;
            return this.token(this.types.ERROR, 'Unrecognized token start');
        } else {
            this.i += longest.length;
            return this.token(this.types.OPERATOR, longest);
        }
    },

    lexIdentifier: function() {
        var start = this.i;
        while (!this.eof() && this.validIdentifier(this.current())) {
            this.next();
        }
        return this.token(this.types.WORD, this.input.substring(start, this.i));
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
    eof: function() {
        return this.i >= this.input.length;
    },

    validIdStart: function(char) {
        return XRegExp("\\p{L}$").test(char) || (char == '-' && XRegExp("\\p{L}$").test(this.peek()));
    },

    validIdentifier: function(char) {
        return XRegExp("[\\p{L}\\p{N}]").test(char) || char == '.' || char == '?' || char == '-';
    },

    validNumberStart: function() {
        return /[0-9]/.test(this.current())
            || (this.current() == '-' && /[0-9]/.test(this.peek()));
    },

    validNumber: function(char) {
        return /[0-9]/.test(char) || char == '.';
    },

    validShuffle: function(char) {
        return /[a-z]/.test(char);
    },

    isSymbol: function(char) {
        return this.syntax.indexOf(char) != -1;
    },

    isSpace: function(char) {
        return char == ' ' || char == '\r' || char == '\n' || char == '\v' || char == '\t';
    },

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

    peek: function(index) {
        var forward = this.i + (index || 1);
        if (forward >= this.input.length) {
            return '';
        }
        return this.input[this.i + (index || 1)];
    },

    current: function() {
        return this.input[this.i];
    },

    sequence: function(val) {
        return this.input.indexOf(val, this.i) == this.i;
    }
}
