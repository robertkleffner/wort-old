var lex = require('./lex');

module.exports = {

    builtIns: [
        // why
        'null',

        // boolean literals
        'true', 'false',

        // basic combinators
        'zap', 'dup', 'swap', 'cat', 'cons', 'unit', 'i', 'dip',

        // some number functions
        'neg',

        // questions
        'null$', 'typeof$',

        // utilities
        'typeof', 'annihilate', 'print', 'printz'
    ],

    locals: [],
    aliases: [],
    analysisErrors: [],

    analyze: function(mod) {
        this.analysisErrors.length = 0;
        this.aliases.length = 0;
        this.locals.length = 0;

        this.cleanseQuestionMarks(mod);
        this.gatherLocals(mod);
        this.definitionAnalysis(mod);
        this.findAliasCollisions(mod);
        this.aliasImports(mod);
        this.splitPublicPrivate(mod);

        mod.analysisErrors = this.analysisErrors;
        return mod;
    },

    cleanseQuestionMarks: function(mod) {
        // convert all question marks in all words to $
        for (var i = 0; i < mod.definitions.length; i++) {
            mod.definitions[i].name = mod.definitions[i].name.replace('?', '$');
            var terms = mod.definitions[i].terms;

            for (var j = 0; j < terms.length; j++) {
                if (terms[j].type == lex.types.WORD) {
                    terms[j].value = terms[j].value.replace('?', '$');
                }
            }
        }
    },

    gatherLocals: function(mod) {
        for (i = 0; i < mod.definitions.length; i++) {
            this.locals.push(mod.definitions[i].name);
        }
    },

    definitionAnalysis: function(mod) {
        for (i = 0; i < mod.definitions.length; i++) {
            this.analyzeTerms(mod.definitions[i].terms);
        }
    },

    analyzeTerms: function(terms) {
        for (var i = 0; i < terms.length; i++) {
            if (terms[i].type == lex.types.WORD) {

                // if it's a built in word mark it as such
                if (this.builtIns.indexOf(terms[i].value) != -1) {
                    terms[i].type = lex.types.BUILT_IN;
                }

                // if this word has no module prefix, it's local, check if it's defined
                else if (terms[i].value.indexOf('.') == -1) {
                    if (this.locals.indexOf(terms[i].value) == -1) {
                        this.error('Undefined local word "' + terms[i].value + '"', terms[i].line);
                    }
                }
            }
        }
    },

    splitPublicPrivate: function(mod) {
        mod.public = [];
        mod.private = [];

        for (var i = 0; i < mod.definitions.length; i++) {
            if (this.isUpper(mod.definitions[i].name[0])) {
                mod.public.push(mod.definitions[i]);
            } else {
                mod.private.push(mod.definitions[i]);
            }
        }
    },

    findAliasCollisions: function(mod) {
        var importNames = [], aliasNames = [];
        for (var i = 0; i < mod.imports.length; i++) {
            if (importNames.indexOf(mod.imports[i].name) != -1) {
                this.error('Importing module "' + mod.imports[i].name + '" twice is redundant', 1);
            } else if (aliasNames.indexOf(mod.imports[i].name) != -1) {
                this.error('Import alias "' + mod.imports[i].name + '" collides with an imported module name', 1);
            } else {
                importNames.push(mod.imports[i].name);
            }

            if (importNames.indexOf(mod.imports[i].alias) != -1) {
                this.error('Import alias "' + mod.imports[i].alias + '" collides with an imported module name', 1);
            } else if (aliasNames.indexOf(mod.imports[i].alias) != -1) {
                this.error('Import alias "' + mod.imports[i].alias + '" collides with a previous import alias', 1);
            } else if (mod.imports[i].alias != '') {
                aliasNames.push(mod.imports[i].alias);
            }
        }
    },

    aliasImports: function(mod) {
        for (var i = 0; i < mod.imports.length; i++) {
            if (mod.imports[i].alias == '') {
                this.aliases.push({from: mod.imports[i].name, to: '$' + i});
            } else {
                this.aliases.push({from: mod.imports[i].alias, to: '$' + i});
            }
        }

        for (var i = 0; i < mod.definitions.length; i++) {
            var terms = mod.definitions[i].terms;
            for (var j = 0; j < terms.length; j++) {
                if (terms[j].type == lex.types.WORD) {

                    for (var k = 0; k < this.aliases.length; k++) {
                        if (terms[j].value.indexOf(this.aliases[k].from) == 0) {
                            terms[j].value = terms[j].value.replace(this.aliases[k].from, this.aliases[k].to);
                        }
                    }

                }
            }
        }

        for (var i = 0; i < mod.imports.length; i++) {
            mod.imports[i].alias = this.aliases[i].to;
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
