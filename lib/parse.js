var lex = require('./lex');

module.exports = {
    input: null,
    lastLine: 1,

    parse: function(input, file) {
        var mod = { definitions: [], imports: [], err: null };
        this.input = input;
        this.lastLine = 1;

        if (!(this.input instanceof Array)) {
            mod.err = this.error('Unrecognized input format', 0);
            return mod;
        }

        mod.name = file;
        try {
            mod.requires = this.parseRequires();
            mod.definitions = this.parseDefinitions();
        } catch (err) {
            mod.err = err;
        }

        return mod;
    },

    parseRequires: function() {
        var requires = [];

        while (this.input.length > 0) {
            if (this.peek().type == lex.types.WORD && this.peek().value == 'require') {
                this.next();
                requires.push(this.parseRequire());
            }

            else if (this.peek().type == lex.types.ERROR) {
                throw this.error(this.peek().value, this.peek().line);
            }

            else {
                break;
            }
        }

        return requires;
    },

    parseRequire: function() {
        var path = this.next();

        if (path.type != lex.types.STRING) {
            throw this.error('Require path must be a string', path.line);
        }

        if (this.next().value != 'as') {
            throw this.error('Require statements must have an alias', path.line);
        }

        if (this.peek().type != lex.types.WORD) {
            throw this.error('A require alias must be a valid identifier', path.line);
        }

        var alias = this.next().value;

        if (this.peek().value != ';') {
            throw this.error('Unterminated require statement', path.line);
        }
        this.next();
        return { path: path.value, alias: alias, line: path.line };
    },

    parseDefinitions: function() {
        var defs = [];

        while (this.input.length > 0) {
            if (this.peek().type == lex.types.ERROR) {
                throw this.error(this.peek().value, this.peek().line);
            }

            if (this.peek().type != lex.types.WORD) {
                throw this.error('Invalid beginning of definition: ' + this.peek().value, this.peek().line);
            }

            defs.push(this.parseDefinition());
        }

        return defs;
    },

    parseDefinition: function() {
        var name = this.next();

        if (this.peek().value != ':') {
            throw this.error('Bad definition format: ' + name.value + ' must be followed by a colon', name.line);
        }
        this.next();

        var terms = this.parseTerms(0);

        if (this.input.length == 0) {
            throw this.error('Unterminated definition: ' + name.value, name.line);
        }
        this.next();

        return { name: name.value, terms: terms, line: name.line };
    },

    parseTerms: function(quotLevel) {
        var terms = [];
        var startLine = 0;
        while (this.input.length > 0 && this.peek().value != ';') {
            if (this.peek().value == '[') {
                startLine = this.next().line;
                terms.push(this.parseTerms(quotLevel + 1));
            }

            else if (this.peek().value == ']') {
                if (quotLevel > 0) {
                    this.next();
                    return terms;
                } else {
                    throw this.error('One too many right brackets', this.peek().line);
                }
            }

            else {
                terms.push(this.next());
            }
        }

        if (quotLevel > 0) {
            throw this.error('Unterminated quotation, add a right bracket', startLine);
        }

        return terms;
    },

    // utility methods
    peek: function(index) {
        if (index >= this.input.length) {
            throw this.error('Unexpected end of input', this.lastLine);
        }
        return this.input[index || 0];
    },

    next: function() {
        if (this.input.length < 1) {
            throw this.error('Unexpected end of input', this.lastLine);
        }
        var res = this.input.shift();
        this.lastLine = res.line;
        return res;
    },

    error: function(value, line) {
        return {value: value, line: line};
    }
};
