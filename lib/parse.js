var lex = require('./lex');

module.exports = {
    input: null,

    parse: function(input) {
        // just here for module data structure reference
        var mod = { definitions: [], imports: [], err: null };
        this.input = input;

        if (!(this.input instanceof Array)) {
            mod.err = this.error('Unrecognized input format', 0);
            return mod;
        }

        try {
            mod.requires = this.parseRequires();
            mod.imports = this.parseImports();
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
        return { path: path, alias: alias };
    },

    parseImports: function() {
        var imports = [];

        while (this.input.length > 0) {
            if (this.peek().type == lex.types.WORD && this.peek().value == 'import') {
                this.next();
                imports.push(this.parseImport());
            }

            else if (this.peek().type == lex.types.ERROR) {
                throw this.error(this.peek().value, this.peek().line);
            }

            else {
                break;
            }
        }

        return imports;
    },

    parseImport: function() {
        var name = this.next(),
            alias = { value: '' };

        if (name.type != lex.types.WORD) {
            throw this.error('Incorrect import name: ' + name.value, name.line);
        }

        if (this.peek().value == 'as') {
            this.next();
            alias = this.next();
            if (alias.type != lex.types.WORD) {
                throw this.error('Invalid alias name: ' + alias.value, alias.line);
            }
        }

        if (this.peek().value != ';') {
            throw this.error('Unterminated import statement', name.line);
        }

        this.next();
        return { name: name.value, alias: alias.value };
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

        var terms = [];
        while (this.input.length > 0 && this.peek().value != ';') {
            terms.push(this.next());
        }

        if (this.input.length == 0) {
            throw this.error('Unterminated definition: ' + name.value, name.line);
        }
        this.next();

        return { name: name.value, terms: terms };
    },

    // utility methods
    peek: function(index) {
        return this.input[index || 0];
    },

    next: function() {
        return this.input.shift();
    },

    error: function(value, line) {
        return {value: value, line: line};
    }
};
