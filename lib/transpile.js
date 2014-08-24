var lex = require('./lex'),
    semantics = require('./semantics'),
    SourceNode = require('source-map').SourceNode;

module.exports = {

    mod: null,
    name: '',

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
            this.emitShuffle,
            this.emitLiteral
        ];
        this.name = this.mod.name + '.wort';

        return this.emitModule();
    },

    emitModule: function() {
        return this.blank('')
            .add(this.emitRequires())
            .add(this.emitModuleHeader())
            .add(this.emitDefinitions())
            .add(this.emitMain());
    },

    emitModuleHeader: function() {
        return (this.mod.hasMain ? 'var $1' : 'module.exports') + ' = (function() {';
    },

    emitRequires: function() {
        var output = this.blank('');
        output.add(this.mod.usesStd ? 'var std = require("wort");' : '');
        var rs = this.mod.requires;
        for (var i = 0; i < rs.length; i++) {
            output.add(this.node(rs[i].line, rs[i].column, ['var ', rs[i].alias, ' = require(', rs[i].path, ');']));
        }
        return output;
    },

    emitDefinitions: function() {
        var output = this.blank('');

        if (this.mod.public.length < 1) { return output; }

        output.add('var $0 = {};')
            .add(this.emitShuffleFuncs())
            .add(this.emitPrivate())
            .add(this.emitPublic())
            .add('return $0;');

        return output;
    },

    emitMain: function() {
        return '})();' + (this.mod.hasMain ? '$1.main([]);' : '');
    },

    emitPublic: function() {
        var output = [];
        var ps = this.mod.public;
        var fnode = null;
        for (var i = 0; i < ps.length; i++) {
            fnode = this.node(ps[i].line, ps[i].column, ['$0.', ps[i].name, ' = function(stack) {']);
            fnode.add(this.emitTerms(ps[i].terms, false));
            fnode.add('};');
            output.push(fnode);
        }
        return output;
    },

    emitPrivate: function() {
        var output = [];
        var ps = this.mod.private;
        var fnode = null;
        for (var i = 0; i < ps.length; i++) {
            fnode = this.node(ps[i].line, ps[i].column, ['function ', ps[i].name, '(stack) {']);
            fnode.add(this.node(ps[i].terms.line, ps[i].terms.column, this.emitTerms(ps[i].terms, false)));
            fnode.add('}');
            output.push(fnode);
        }
        return output;
    },

    emitTerms: function(terms, inQuot, line, column) {
        if (terms.length < 1) {
            return '';
        }

        var output = [];
        for (var i = 0; i < terms.length; i++) {
            if (terms[i] instanceof Array) {
                if (inQuot) {
                    output.push(this.node(terms[i].line, terms[i].column, ['[', this.emitTerms(terms[i], true), ']']));
                    if (i != terms.length - 1) {
                        output.push(',');
                    }
                } else {
                    output.push(this.node(terms[i].line, terms[i].column, ['stack.push([', this.emitTerms(terms[i], true), ']);']));
                }
            } else {
                output.push(this.node(terms[i].line, terms[i].column, this.emits[terms[i].type].call(this, terms[i], inQuot)));
                if (inQuot && i != terms.length - 1) {
                    output.push(',');
                }
            }
        }
        return output;
    },

    emitWord: function(word, inQuot) {
        var prefix = word.localPub ? '$0.' : '';
        if (!inQuot) {
            return this.node(word.line, word.column, [prefix, word.value, '(stack);']);
        }
        return this.node(word.line, word.column, [prefix, word.value]);
    },

    emitOperator: function(op, inQuot) {
        var name = this.op_funcs[lex.operators.indexOf(op.value)];
        if (!inQuot) {
            return this.node(op.line, op.column, ['std.', name, '(stack);']);
        }
        return this.node(op.line, op.column, ['std.', name]);
    },

    emitLiteral: function(lit, inQuot) {
        if (!inQuot) {
            return this.node(lit.line, lit.column, ['stack.push(', lit.value, ');']);
        }
        return this.node(lit.line, lit.column, lit.value);
    },

    emitProperty: function(prop, inQuot) {
        var type = prop.value.substring(0, 2);
        var name = prop.value.substring(2, prop.length);

        if (!inQuot) {
            return this.node(prop.line, prop.column, ['std.', this.op_funcs[lex.operators.indexOf(type)], '(stack, "', name, '");']);
        }
        return this.node(prop.line, prop.column, ['std.', this.op_funcs[lex.operators.indexOf(type)], '.bind(std, stack, "', name, '")']);
    },

    emitInlineJS: function(js, inQuot) {
        return this.node(js.line, js.column, js.value);
    },

    emitBuiltIn: function(word, inQuot) {
        var name = 'std.' + word.value[0].toUpperCase() + word.value.slice(1, word.value.length);
        if (!inQuot) {
            return this.node(word.line, word.column, name + '(stack);');
        }
        return this.node(word.line, word.column, name);
    },

    emitShuffleFuncs: function() {
        var output = this.blank('');
        for (var i = 0; i < this.mod.shuffles.length; i++) {
            output.add(['function $shuffle', ''+i, '(stack) {'])
                .add(this.emitShuffleFunc(this.mod.shuffles[i]))
                .add('}');
        }
        return output;
    },

    emitShuffleFunc: function(shuffle) {
        var halves = shuffle.split('-'), output = this.blank('');
        defs = halves[0].split('').reverse().join('');
        used = halves[1];

        for (var i = 0; i < defs.length; i++) {
            output.add(['var ', defs[i], ' = stack.pop();']);
        }

        for (var i = 0; i < used.length; i++) {
            output.add(['stack.push(', used[i], ');']);
        }

        return output;
    },

    emitShuffle: function(shuffle, inQuot) {
        var name = '$shuffle' + this.mod.shuffles.indexOf(shuffle.value);
        if (!inQuot) {
            return this.node(shuffle.line, shuffle.column, name + '(stack);');
        }
        return this.node(shuffle.line, shuffle.column, name);
    },

    node: function(line, column, chunk) {
        return new SourceNode(line, column, this.name, chunk);
    },

    blank: function(chunk) {
        return new SourceNode(null, null, null, chunk);
    }
};
