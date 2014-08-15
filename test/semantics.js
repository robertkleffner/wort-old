var should = require('chai').should(),
    lex = require('../lib/lex'),
    parser = require('../lib/parse'),
    semantics = require('../lib/semantics');

describe('#semantics', function() {
    it('should return an empty module on empty input', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('')));
        mod.analysisErrors.should.have.length(0);
        mod.public.should.have.length(0);
        mod.private.should.have.length(0);
    });

    it('should perform some simple conversions', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('Main: dup; -priv: zap;')));
        mod.analysisErrors.should.have.length(0);
        mod.public.should.have.length(1);
        mod.private.should.have.length(1);
        mod.public[0].name.should.equal('Main');
        mod.private[0].name.should.equal('_priv');
        mod.public[0].terms[0].type.should.equal(lex.types.BUILT_IN);
        mod.private[0].terms[0].type.should.equal(lex.types.BUILT_IN);
    });

    it('should catch undefined local words', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('main: hodor;')));
        mod.analysisErrors.should.have.length(1);
        mod.analysisErrors[0].value.should.equal('Undefined local word "hodor"');
    });

    it('should catch names defined twice', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('Main: 2; Main: 3;')));
        mod.analysisErrors.should.have.length(1);
        mod.analysisErrors[0].value.should.equal('Word "Main" is defined twice');
    });

    it('should catch names overwriting built in words', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('dup: 2;')));
        mod.analysisErrors.should.have.length(1);
        mod.analysisErrors[0].value.should.equal('"dup" is a reserved word and cannot be a definition name');
    });

    it('should detect boolean literals', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('test: true false null undefined;')));
        mod.analysisErrors.should.have.length(0);
        mod.definitions[0].terms[0].type.should.equal(lex.types.WORD_LITERAL);
        mod.definitions[0].terms[1].type.should.equal(lex.types.WORD_LITERAL);
        mod.definitions[0].terms[2].type.should.equal(lex.types.WORD_LITERAL);
        mod.definitions[0].terms[3].type.should.equal(lex.types.WORD_LITERAL);
    });

    it('should not allow definition names to have periods', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('one.two: 2;')));
        mod.analysisErrors.should.have.length(1);
        mod.analysisErrors[0].value.should.equal('Definition names cannot contain periods');
    });

    it('should strip question marks from names', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('-main: null? [null?];')));
        mod.analysisErrors.should.have.length(0);
        mod.private[0].terms[0].value.should.equal('null$');
        mod.private[0].terms[1][0].value.should.equal('null$');
    });

    it('should accept external and local definitions', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('require "./hodor" as hodor; main: hodor.hodor foo; foo: 2;')));
        mod.analysisErrors.should.have.length(0);
        mod.definitions[0].terms[0].value.should.equal('hodor.hodor');
        mod.definitions[0].terms[1].value.should.equal('foo');
    });

    it('should detect duplicate require aliases', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('require "./hodor" as t; require "./test" as t;')));
        mod.analysisErrors.should.have.length(1);
        mod.analysisErrors[0].value.should.equal('Require alias "t" is used more than once')
    });

    it('should mark whether the module uses the standard library', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('Dup: dup;')));
        mod.analysisErrors.should.have.length(0);
        mod.usesStd.should.equal(true);
    });

    it('should detect a public Main method if present', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('main: 2;')));
        mod.analysisErrors.should.have.length(0);
        mod.hasMain.should.equal(true);

        var mod = semantics.analyze(parser.parse(lex.lex('-main: 2;')));
        mod.analysisErrors.should.have.length(0);
        mod.hasMain.should.equal(false);
    });

    it('should mark local public word calls', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('Test: 2; main: Test;')));
        mod.analysisErrors.should.have.length(0);
        mod.definitions[1].terms[0].localPub.should.equal(true);
    });

    it('should analyze terms inside a quotation', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('Test: 2; main: [Test];')));
        mod.analysisErrors.should.have.length(0);
        mod.definitions[1].terms[0][0].localPub.should.equal(true);
    });

    it('should validate stack shuffle sequences', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('test: (abc-ac) (abc-ac);')));
        mod.analysisErrors.should.have.length(0);
        mod.shuffles.should.have.length(1);
        mod.shuffles[0].should.equal('abc-ac');

        mod = semantics.analyze(parser.parse(lex.lex('test: (aa-);')));
        mod.analysisErrors.should.have.length(1);
        mod.analysisErrors[0].value.should.equal('Left hand side of shuffle cannot define variable "a" more than once');

        mod = semantics.analyze(parser.parse(lex.lex('test: (-abc);')));
        mod.analysisErrors.should.have.length(1);
        mod.analysisErrors[0].value.should.equal('Shuffle sequence must have at least one variable on left hand side');

        mod = semantics.analyze(parser.parse(lex.lex('test: (a-ab);')));
        mod.analysisErrors.should.have.length(1);
        mod.analysisErrors[0].value.should.equal('Shuffle variable "b" not found on left hand side of shuffle')
    });

    it('should cleanse all built in words', function() {
        var mod;
        for (var i = 0; i < semantics.builtIns.length; i++) {
            mod = semantics.analyze(parser.parse(lex.lex('test: ' + semantics.builtIns[i].replace('$', '?').replace('_', '-') + ' ;')));
            mod.analysisErrors.should.have.length(0);
            mod.definitions[0].terms[0].value.should.equal(semantics.builtIns[i]);
        }
    });
});
