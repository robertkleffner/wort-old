var should = require('chai').should(),
    lex = require('../lib/lex');
    parser = require('../lib/parse.js');

describe('#parse', function() {
    it('should return an empty array on empty input', function() {
        var res = parser.parse(lex.lex(''));
        res.should.have.length(0);
    });
});
