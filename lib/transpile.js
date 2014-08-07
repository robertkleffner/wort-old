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
        'add', 'sub', 'mul', 'div', 'rem', 'inc', 'dec',
        'complement', 'band', 'bor', 'xor', 'shl', 'shr', 'shr_u',
        'and', 'or', 'not',
        'same', 'notsame', 'eq', 'noteq', 'less', 'lesseq', 'greater', 'greatereq',
        'setvalobj', 'setobjval', 'getprop'
    ],

    transpile: function(mod, target) {
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
            this.emitBuiltIn
        ];

        switch (target) {
            case this.targets.NODE:
                return this.transpileNode();
            case this.targets.BROWSER:
                return this.transpileBrowser();
            default:
                return 'Must specify a transpile target';
        }
    },

    transpileNode: function() {
        var output = this.emitNamespace();
        output += this.emitRequires();

        output += this.emitModuleHeader();
        output += this.emitDefinitions();
        output += '})();\n';

        if (this.mod.hasMain) {
            output += this.emitMain();
        } else {
            output += 'module.exports = ' + this.mod.name + ';\n';
        }

        return output;
    },

    transpileBrowser: function() {
        var output = this.emitNamespace();

        output += this.emitModuleHeader();
        output += this.emitDefinitions();
        output += '})();\n';
        output += this.emitMain();

        return output;
    },

    emitNamespace: function() {
        var pieces = this.mod.name.split('.');
        var output = '';
        var first = true;
        while (pieces.length > 1) {
            output += first ? 'var ' : '';
            output += pieces[0] + ' = ' + pieces[0] + ' || {};\n';
            var prefix = pieces.shift();
            pieces[0] = prefix + '.' + pieces[0];
        }
        return output;
    },

    emitModuleHeader: function() {
        var output = (this.mod.name.indexOf('.') == -1) ? 'var ' : '';
        return output + this.mod.name + ' = (function() {\n';
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

        output += this.emitPrivate();
        output += this.emitPublic();

        output += 'return $0;\n';
        return output;
    },

    emitMain: function() {
        if (this.mod.hasMain) {
            return this.mod.name + '.Main([]);\n';
        }
        return '';
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
        if (!inQuot) {
            return word.value + '(stack);';
        }
        return word.value;
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
        if (!inQuot) {
            return 'std.' + word.value + '(stack);';
        }
        return 'std.' + word.value;
    }
};
