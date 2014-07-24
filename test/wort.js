var should = require('chai').should(),
    wort = require('../lib/wort');

describe('#compile', function() {
    it('returns 0', function() {
        wort.compile().should.equal(0);
    });
});
