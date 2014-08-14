var lex = require('./lex'),
    semantics = require('./semantics');

module.exports = {

    mod: null,
    literals: [],

    targets: {
        NODE: 0,
        BROWSER: 1
    },

    emits: [],

    op_funcs: [
        'Add', 'Sub', 'Mul', 'Div', 'Rem', 'Inc', 'Dec',
        'Complement', 'Band', 'Bor', 'Xor', 'Shl', 'Shr', 'Shr_u',
        'And', 'Or', 'Not',
        'Same', 'Notsame', 'Eq', 'Noteq', 'Less', 'Lesseq', 'Greater', 'Greatereq',
        'Setvalobj', 'Setobjval', 'Getprop'
    ],

    transpile: function(mod) {
        this.mod = mod;
        this.emits = [
            this.emitWord,
            null,
            this.emitOperator,
            this.emitLiteral,
            this.emitLiteral,
            this.emitLiteral,
            this.emitProperty,
            this.emitInlineJS,
            this.emitBuiltIn,
            this.emitShuffle
        ];

        return this.emitModule();
    },

    emitModule: function() {
        var output = this.emitRequires();

        output += this.emitModuleHeader();
        output += this.emitDefinitions();
        output += '})();\n';

        if (this.mod.hasMain) {
            output += this.emitMain();
        }

        return output;
    },

    emitModuleHeader: function() {
        return (this.mod.hasMain ? 'var $1' : 'module.exports') + ' = (function() {\n';
    },

    emitRequires: function() {
        var output = this.mod.usesStd ? 'var std = require("wort");\n' : '';
        var rs = this.mod.requires;
        for (var i = 0; i < rs.length; i++) {
            output += 'var ' + rs[i].alias + ' = require(' + rs[i].path + ');\n';
        }
        return output;
    },

    emitDefinitions: function() {
        var output = '';

        if (this.mod.public.length < 1) { return output; }

        output += 'var $0 = {};\n';

        output += this.emitShuffleFuncs();
        output += this.emitPrivate();
        output += this.emitPublic();

        output += 'return $0;\n';
        return output;
    },

    emitMain: function() {
        return this.mod.hasMain ? '$1.main([]);\n' : '';
    },

    emitPublic: function() {
        var output = '';
        var ps = this.mod.public;
        for (var i = 0; i < ps.length; i++) {
            output += '$0.' + ps[i].name + ' = function(stack) {\n';
            output += this.emitTerms(ps[i].terms, false);
            output += '};\n'
        }
        return output;
    },

    emitPrivate: function() {
        var output = '';
        var ps = this.mod.private;
        for (var i = 0; i < ps.length; i++) {
            output += 'function ' + ps[i].name + '(stack) {\n';
            output += this.emitTerms(ps[i].terms, false);
            output += '}\n'
        }
        return output;
    },

    emitTerms: function(terms, inQuot) {
        var output = '';
        for (var i = 0; i < terms.length; i++) {
            if (terms[i] instanceof Array) {
                if (inQuot) {
                    output += '[' + this.emitTerms(terms[i], true) + ']';
                    if (i != terms.length-1) {
                        output += ',';
                    }
                } else {
                    output += 'stack.push([' + this.emitTerms(terms[i], true) + ']);\n';
                }
            } else {
                output += this.emits[terms[i].type].call(this, terms[i], inQuot);
                if (inQuot) {
                    if (i != terms.length -1) {
                        output += ',';
                    }
                } else {
                    output += '\n'
                }
            }
        }
        return output;
    },

    emitWord: function(word, inQuot) {
        var prefix = word.localPub ? '$0.' : '';
        if (!inQuot) {
            return prefix + word.value + '(stack);';
        }
        return prefix + word.value;
    },

    emitOperator: function(op, inQuot) {
        var name = this.op_funcs[lex.operators.indexOf(op.value)];
        if (!inQuot) {
            return 'std.' + name + '(stack);';
        }
        return 'std.' + name;
    },

    emitLiteral: function(lit, inQuot) {
        if (!inQuot) {
            return 'stack.push(' + lit.value + ');';
        }
        return lit.value;
    },

    emitProperty: function(prop, inQuot) {
        var type = prop.value.substring(0, 2);
        var name = prop.value.substring(2, prop.length);
        if (!inQuot) {
            return 'std.' + this.op_funcs[lex.operators.indexOf(type)] + '(stack, "' + name + '");';
        }
        return 'std.' + this.op_funcs[lex.operators.indexOf(type)] + '.bind(std, stack, "' + name + '")';
    },

    emitInlineJS: function(js, inQuot) {
        return js.value;
    },

    emitBuiltIn: function(word, inQuot) {
        var name = 'std.' + word.value[0].toUpperCase() + word.value.slice(1, word.value.length);
        if (!inQuot) {
            return name + '(stack);';
        }
        return name;
    },

    emitShuffleFuncs: function() {
        var output = '';
        for (var i = 0; i < this.mod.shuffles.length; i++) {
            output += 'function $shuffle' + i + '(stack) {\n'
            output += this.emitShuffleFunc(this.mod.shuffles[i]);
            output += '}\n';
        }
        return output;
    },

    emitShuffleFunc: function(shuffle) {
        var halves = shuffle.split('-'), output = '';
        defs = halves[0].split('').reverse().join('');
        used = halves[1];

        for (var i = 0; i < defs.length; i++) {
            output += 'var ' + defs[i] + ' = stack.pop();\n';
        }

        for (var i = 0; i < used.length; i++) {
            output += 'stack.push(' + used[i] + ');\n';
        }

        return output;
    },

    emitShuffle: function(shuffle, inQuot) {
        var name = '$shuffle' + this.mod.shuffles.indexOf(shuffle.value);
        if (!inQuot) {
            return name + '(stack);'
        }
        return name;
    }
};
