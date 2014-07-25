var should = require('chai').should(),
    lex = require('../lib/lex');

describe("#lex", function() {
    it('should return an empty array for empty input', function() {
        var res = lex.lex("");
        res.should.be.an('array');
        res.should.have.length(0);

        res = lex.lex(" \t\n");
        res.should.be.an('array');
        res.should.have.length(0);
        lex.line.should.equal(2);
    });

    it('should ignore comments', function() {
        var res = lex.lex('# this is a comment \n');
        res.should.have.length(0);
        lex.line.should.equal(2);
    });

    it('should gracefully handle unterminated inline js', function() {
        var res = lex.lex('~~~ unterminated js \n ');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.ERROR);
        lex.line.should.equal(1);
    });

    it('should preserve inline javascript', function() {
        var res = lex.lex('~~~ console.log("here be inline js!");\n ~~~');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.INLINE_JS);
        res[0].value.should.equal(' console.log("here be inline js!");\n ');
        lex.line.should.equal(2);
    });

    it('should gracefully handle unterminated object literals', function() {
        var res = lex.lex('{ obj: {}, ');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.ERROR);
    });

    it('should handle object literal syntax similar to js', function() {
        var res = lex.lex('{ name: "friedrich", data: { crazy: true }}');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.OBJECT);
        res[0].value.should.equal('{ name: "friedrich", data: { crazy: true }}');
    });

    it('should gracefully handle improper property setters and readers', function() {
        var res = lex.lex('->*');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.ERROR);

        res = lex.lex('<-*');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.ERROR);

        res = lex.lex('@*');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.ERROR);
    });

    it('should emit property setters for objects', function() {
        var res = lex.lex('->hello');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.PROPERTY);
        res[0].value.should.equal('->hello');

        res = lex.lex('<-wort2.thing');
        res[0].type.should.equal(lex.types.PROPERTY);
        res[0].value.should.equal('<-wort2.thing');
    });

    it('should emit property readers for objects', function() {
        var res = lex.lex('@hello');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.PROPERTY);
        res[0].value.should.equal('@hello');
    });

    it('should gracefully handle unterminated string constants', function() {
        var res = lex.lex('"unterminated');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.ERROR);
    });

    it('should emit string literals', function() {
        var res = lex.lex('"Hello, World!\\n\\\"blah"');
        res.should.have.length(1);
        res[0].type.should.equal(lex.types.STRING);
        res[0].value.should.equal('"Hello, World!\\n\\\"blah"');
    });
});
