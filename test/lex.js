var should = require('chai').should(),
    lex = require('../lib/lex');

describe("#lex", function() {
    it('should return an empty array for empty input', function() {
        var res1 = lex.lex("");
        res1.should.be.an('array');
        res1.should.have.length(0);

        var res2 = lex.lex(" \t\n");
        res2.should.be.an('array');
        res2.should.have.length(0);
        lex.line.should.equal(2);
    });

    it('should ignore comments', function() {
        var res1 = lex.lex('# this is a comment \n');
        res1.should.have.length(0);
        lex.line.should.equal(2);
    });

    it('should gracefully handle unterminated inline js', function() {
        var res1 = lex.lex('~~~ unterminated js \n ');
        res1.should.have.length(1);
        res1[0].type.should.equal(lex.types.ERROR);
        lex.line.should.equal(1);
    });

    it('should preserve inline javascript', function() {
        var res1 = lex.lex('~~~ console.log("here be inline js!");\n ~~~');
        res1.should.have.length(1);
        res1[0].type.should.equal(lex.types.INLINE_JS);
        res1[0].value.should.equal(' console.log("here be inline js!");\n ');
        lex.line.should.equal(2);
    });

    it('should gracefully handle unterminated object literals', function() {
        var res1 = lex.lex('{ obj: {}, ');
        res1.should.have.length(1);
        res1[0].type.should.equal(lex.types.ERROR);
    });

    it('should handle object literal syntax similar to js', function() {
        var res1 = lex.lex('{ name: "friedrich", data: { crazy: true }}');
        res1.should.have.length(1);
        res1[0].type.should.equal(lex.types.OBJECT);
        res1[0].value.should.equal('{ name: "friedrich", data: { crazy: true }}');
    });
});
