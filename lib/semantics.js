var lex = require('./lex');

module.exports = {

    builtIns: [
        // basic combinators
        'zap', 'dup', 'swap', 'cat', 'cons', 'uncons', 'unit', 'i', 'x', 'dip',

        // some number functions
        'neg', 'to_num', 'to_int',

        // type questions
        'typeof', 'null$', 'undefined$', 'typeof$', 'quotation$', 'string$', 'number$', 'boolean$', 'object$',

        // object utilities
        'freeze', 'frozen$', 'seal', 'sealed$', 'stagnate', 'stagnant$',

        // collection utilities
        'empty$', 'in$', 'has$', 'where$', 'slice', 'slice_from', 'cut', 'insert', 'splice', 'reverse', 'sort',

        // branching operators
        'case', 'branch', 'if', 'if_else', 'cond',

        // repetition operators
        'while', 'linrec', 'tailrec', 'genrec', 'step', 'fold', 'map', 'times', 'filter', 'split',

        // cleave, spread, and apply combinators
        'cleave', 'spread', 'apply',

        // stack utilities
        'annihilate', 'gather', 'substitute',

        // utilities
        'to_string', 'print', 'printz', 'print_stack'
    ],

    wordLiterals: [
        'true', 'false', 'null', 'undefined'
    ],

    locals: [],
    aliases: [],
    analysisErrors: [],
    shuffles: [],

    analyze: function(mod) {
        mod.usesStd = false;
        this.analysisErrors.length = 0;
        this.aliases.length = 0;
        this.locals.length = 0;
        this.shuffles.length = 0;

        this.cleanseIdentifiers(mod);
        this.gatherLocals(mod);
        this.definitionAnalysis(mod);
        this.findAliasCollisions(mod);
        this.splitPublicPrivate(mod);
        this.findMain(mod);

        mod.analysisErrors = this.analysisErrors;
        mod.shuffles = this.shuffles;
        return mod;
    },

    cleanseIdentifiers: function(mod) {
        // convert all question marks in all words to $
        for (var i = 0; i < mod.definitions.length; i++) {
            mod.definitions[i].orig = mod.definitions[i].name;
            mod.definitions[i].name = mod.definitions[i].name.replace('?', '$').replace('-', '_');
            this.cleanseTerms(mod.definitions[i].terms);
        }
    },

    cleanseTerms: function(terms) {
        for (var j = 0; j < terms.length; j++) {
            if (terms[j] instanceof Array) {
                this.cleanseTerms(terms[j]);
            }

            else if (terms[j].type == lex.types.WORD) {
                terms[j].orig = terms[j].value;
                terms[j].value = terms[j].value.replace('?', '$').replace('-', '_');
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

            this.findUndefined(mod, mod.definitions[i].terms);
            this.examineShuffles(mod, mod.definitions[i].terms);
        }
    },

    findUndefined: function(mod, terms) {
        for (var i = 0; i < terms.length; i++) {
            // recursively analyze quotations
            if (terms[i] instanceof Array) {
                this.findUndefined(mod, terms[i]);
            }

            else if (terms[i].type == lex.types.WORD) {

                // convert 'true' and 'false' to their javascript values
                if (this.wordLiterals.indexOf(terms[i].value) != -1) {
                    terms[i].type = lex.types.WORD_LITERAL;
                }

                // if it's a built in word mark it as such
                else if (this.builtIns.indexOf(terms[i].value) != -1) {
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

            else if (terms[i].type === lex.types.PROPERTY || terms[i].type === lex.types.OPERATOR) {
                mod.usesStd = true;
            }
        }
    },

    examineShuffles: function(mod, terms) {
        for (var i = 0; i < terms.length; i++) {
            if (terms[i] instanceof Array) {
                this.examineShuffles(mod, terms[i]);
            }

            else if (terms[i].type == lex.types.SHUFFLE) {
                var halves = terms[i].value.split('-');

                if (halves[0].length < 1) {
                    this.error('Shuffle sequence must have at least one variable on left hand side', terms[i].line);
                    continue;
                }

                var defvars = halves[0].split(''),
                    usevars = halves[1].split('');

                for (var j = 0; j < defvars.length; j++) {
                    if (defvars.lastIndexOf(defvars[j]) != j) {
                        this.error('Left hand side of shuffle cannot define variable "' + defvars[j] + '" more than once', terms[i].line);
                    }
                }

                for (var j = 0; j < usevars.length; j++) {
                    if (defvars.indexOf(usevars[j]) == -1) {
                        this.error('Shuffle variable "' + usevars[j] + '" not found on left hand side of shuffle', terms[i].line);
                    }
                }

                if (this.shuffles.indexOf(terms[i].value) == -1) {
                    this.shuffles.push(terms[i].value);
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
