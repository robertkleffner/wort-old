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
        var mod = semantics.analyze(parser.parse(lex.lex('Main: dup; priv: zap;')));
        mod.analysisErrors.should.have.length(0);
        mod.public.should.have.length(1);
        mod.private.should.have.length(1);
        mod.public[0].name.should.equal('Main');
        mod.private[0].name.should.equal('priv');
        mod.public[0].terms[0].type.should.equal(lex.types.BUILT_IN);
        mod.private[0].terms[0].type.should.equal(lex.types.BUILT_IN);
    });

    it('should catch undefined local words', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('main: hodor;')));
        mod.analysisErrors.should.have.length(1);
        mod.analysisErrors[0].value.should.equal('Undefined local word "hodor"');
    });

    it('should strip question marks from names', function() {
        var mod = semantics.analyze(parser.parse(lex.lex('main: null?;')));
        mod.analysisErrors.should.have.length(0);
        mod.private[0].terms[0].value.should.equal('null$');
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
});
