var should = require('chai').should(),
    lex = require('../lib/lex'),
    parser = require('../lib/parse');

describe('#parse', function() {
    it('should return an empty module on empty input', function() {
        var res = parser.parse(lex.lex(''));
        res.definitions.should.have.length(0);
        res.imports.should.have.length(0);
        should.not.exist(res.err);
    });

    it('should skip comments', function() {
        var res = parser.parse(lex.lex('# I am a comment\n'));
        res.definitions.should.have.length(0);
        res.imports.should.have.length(0);
    });

    it('should parse input with only imports', function() {
        var res = parser.parse(lex.lex('import hodor; import hodor as hodor;'));
        res.definitions.should.have.length(0);
        res.imports.should.have.length(2);
    });

    it('should parse input with only definitions', function() {
        var res = parser.parse(lex.lex('main: hodor; main: hodor;'));
        res.definitions.should.have.length(2);
        res.imports.should.have.length(0);
    });

    it('should keep names and aliases for imports', function() {
        var res = parser.parse(lex.lex('import hodor;'));
        res.imports[0].name.should.equal('hodor');
        res.imports[0].alias.should.equal('');

        res = parser.parse(lex.lex('import hodor as hodor;'));
        res.imports[0].name.should.equal('hodor');
        res.imports[0].alias.should.equal('hodor');
    });

    it('should keep names for definitions', function() {
        var res = parser.parse(lex.lex('main: hodor;'));
        should.not.exist(res.err);
        res.definitions[0].name.should.equal('main');
    });

    it('should parse numbers as terms', function() {
        var res = parser.parse(lex.lex('main: 1 -3 3.1415;'));
        res.definitions[0].terms.should.have.length(3);
        res.definitions[0].terms[0].type.should.equal(lex.types.NUMBER);
        res.definitions[0].terms[0].value.should.equal('1');
        res.definitions[0].terms[1].type.should.equal(lex.types.NUMBER);
        res.definitions[0].terms[1].value.should.equal('-3');
        res.definitions[0].terms[2].type.should.equal(lex.types.NUMBER);
        res.definitions[0].terms[2].value.should.equal('3.1415');
    });

    it('should parse strings as terms', function() {
        var res = parser.parse(lex.lex('main: "hello" "escape\\\" sequence\\n";'));
        res.definitions[0].terms.should.have.length(2);
        res.definitions[0].terms[0].type.should.equal(lex.types.STRING);
        res.definitions[0].terms[0].value.should.equal('"hello"');
        res.definitions[0].terms[1].type.should.equal(lex.types.STRING);
        res.definitions[0].terms[1].value.should.equal('"escape\\\" sequence\\n"');
    });
});
