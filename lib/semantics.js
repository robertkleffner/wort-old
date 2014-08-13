var lex = require('./lex');

module.exports = {

    builtIns: [
        // hodor
        'null',

        // boolean literals
        'true', 'false',

        // basic combinators
        'zap', 'dup', 'swap', 'cat', 'cons', 'unit', 'i', 'dip',

        // some number functions
        'neg',

        // type questions
        'typeof', 'null$', 'typeof$', 'quotation$', 'string$', 'number$', 'boolean$', 'object$',

        // object utilities
        'freeze', 'frozen$', 'seal', 'sealed$', 'stagnate', 'stagnant$',

        // collection utilities
        'empty$', 'in$', 'has$', 'where$', 'slice', 'slice-from', 'cut', 'insert', 'splice', 'reverse', 'sort',

        // branching operators
        'case', 'branch', 'if', 'if-else', 'cond',

        // repetition operators
        'while', 'linrec', 'tailrec', 'genrec', 'step', 'fold', 'map', 'times', 'filter', 'split',

        // stack utilities
        'annihilate', 'gather', 'spread', 'substitute',

        // utilities
        'to-string', 'print', 'printz'
    ],

    locals: [],
    aliases: [],
    analysisErrors: [],

    analyze: function(mod) {
        mod.usesStd = false;
        this.analysisErrors.length = 0;
        this.aliases.length = 0;
        this.locals.length = 0;

        this.cleanseIdentifiers(mod);
        this.gatherLocals(mod);
        this.definitionAnalysis(mod);
        this.findAliasCollisions(mod);
        this.splitPublicPrivate(mod);
        this.findMain(mod);

        mod.analysisErrors = this.analysisErrors;
        return mod;
    },

    cleanseIdentifiers: function(mod) {
        // convert all question marks in all words to $
        for (var i = 0; i < mod.definitions.length; i++) {
            mod.definitions[i].orig = mod.definitions[i].name;
            mod.definitions[i].name = mod.definitions[i].name.replace('?', '$').replace('-', '_');
            var terms = mod.definitions[i].terms;

            for (var j = 0; j < terms.length; j++) {
                if (terms[j].type == lex.types.WORD) {
                    terms[j].orig = terms[j].value;
                    terms[j].value = terms[j].value.replace('?', '$').replace('-', '_');
                }
            }
        }
    },

    gatherLocals: function(mod) {
        for (i = 0; i < mod.definitions.length; i++) {
            if (this.locals.indexOf(mod.definitions[i].name) != -1) {
                this.error('Word "' + mod.definitions[i].orig + '" is defined twice', mod.definitions[i].line);
            } else {
                this.locals.push(mod.definitions[i].name);
            }
        }
    },

    definitionAnalysis: function(mod) {
        for (i = 0; i < mod.definitions.length; i++) {
            if (mod.definitions[i].name.indexOf('.') !== -1) {
                this.error('Definition names cannot contain periods', mod.definitions[i].line);
            }

            if (this.builtIns.indexOf(mod.definitions[i].name) !== -1) {
                this.error('"' + mod.definitions[i].orig + '" is a reserved word and cannot be a definition name', mod.definitions[i].line);
            }

            this.analyzeTerms(mod, mod.definitions[i].terms);
        }
    },

    analyzeTerms: function(mod, terms) {
        for (var i = 0; i < terms.length; i++) {
            // recursively analyze quotations
            if (terms[i] instanceof Array) {
                this.analyzeTerms(mod, terms[i]);
            }

            else if (terms[i].type == lex.types.WORD) {

                // if it's a built in word mark it as such
                if (this.builtIns.indexOf(terms[i].value) != -1) {
                    terms[i].type = lex.types.BUILT_IN;
                    mod.usesStd = true;
                }

                // if this word has no module prefix, it's local, check if it's defined
                else if (terms[i].value.indexOf('.') == -1) {
                    if (this.locals.indexOf(terms[i].value) == -1) {
                        this.error('Undefined local word "' + terms[i].orig + '"', terms[i].line);
                    }

                    // mark it as a local public call for the transpile phase
                    if (terms[i].value[0] !== '_') {
                        terms[i].localPub = true;
                    } else {
                        terms[i].localPub = false;
                    }
                }
            }
        }
    },

    splitPublicPrivate: function(mod) {
        mod.public = [];
        mod.private = [];

        for (var i = 0; i < mod.definitions.length; i++) {
            if (mod.definitions[i].public) {
                mod.public.push(mod.definitions[i]);
            } else {
                mod.private.push(mod.definitions[i]);
            }
        }
    },

    findAliasCollisions: function(mod) {
        var requireAliases = [];
        for (var i = 0; i < mod.requires.length; i++) {
            if (requireAliases.indexOf(mod.requires[i].alias) != -1) {
                this.error('Require alias "' + mod.requires[i].alias + '" is used more than once', mod.requires[i].line);
            } else {
                requireAliases.push(mod.requires[i].alias);
            }
        }
    },

    findMain: function(mod) {
        mod.hasMain = false;
        for (var i = 0; i < mod.public.length; i++) {
            if (mod.public[i].name == 'main') {
                mod.hasMain = true;
            }
        }
    },

    // utility functions
    isUpper: function(char) {
        return /[A-Z]/.test(char);
    },

    error: function(message, line) {
        this.analysisErrors.push({ value: message, line: line });
    }
};
