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

    it('should emit number literals', function() {
        var res = lex.lex('0 1.4 -3');
        res.should.have.length(3);
        res[0].type.should.equal(lex.types.NUMBER);
        res[0].value.should.equal('0');
        res[1].type.should.equal(lex.types.NUMBER);
        res[1].value.should.equal('1.4');
        res[2].type.should.equal(lex.types.NUMBER);
        res[2].value.should.equal('-3');
    });

    it('should emit symbols', function() {
        var res = lex.lex('; : [ ]');
        res.should.have.length(4);
        res[0].type.should.equal(lex.types.SYMBOL);
        res[0].value.should.equal(';');
        res[1].type.should.equal(lex.types.SYMBOL);
        res[1].value.should.equal(':');
        res[2].type.should.equal(lex.types.SYMBOL);
        res[2].value.should.equal('[');
        res[3].type.should.equal(lex.types.SYMBOL);
        res[3].value.should.equal(']');
    });

    it('should emit arithmetic operators', function() {
        var res = lex.lex('+ - * / % ++ --');
        res.should.have.length(7);
    });

    it('should emit bitwise operators', function() {
        var res = lex.lex('~ & | ^ << >> >>>');
        res.should.have.length(7);
    });

    it('should emit logical operators', function() {
        var res = lex.lex('&& || !');
        res.should.have.length(3);
    });

    it('should emit comparison operators', function() {
        var res = lex.lex('= != == !== < <= > >=');
        res.should.have.length(8);
    });

    it('should emit object access operators', function() {
        var res = lex.lex('-> <- @');
        res.should.have.length(3);
    });

    it('should emit identifiers', function() {
        var res = lex.lex('import ho_dor ho.dor ho?dor');
        res.should.have.length(4);
        res[0].type.should.equal(lex.types.WORD);
        res[1].type.should.equal(lex.types.WORD);
        res[2].type.should.equal(lex.types.WORD);
        res[3].type.should.equal(lex.types.WORD);
    });
});
