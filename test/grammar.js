var should = require('chai').should(),
    g = require('../src/wort-syntax.js');

describe('#parse', function() {
    it('should return empty on empty input', function() {
        var res = g.parse('');
    });

    it('should skip comments', function() {
        var res = g.parse('# hello\n');
    });

    it('should parse require statements', function() {
        g.parse('require \'./hodor\' as hodor ;');
        g.parse('require \'./hodor\' as hodor ;\nrequire \'noob\' as lol ;');
    });

    it('should parse basic terms', function() {
        g.parse('main : 2 ;');
        g.parse('main : -5 ;');
        g.parse('main : 3.14 ;');
        g.parse('main : -5.8 ;');
        g.parse('main : 6.78e9 ;');
        g.parse('main : 0xDEADBEEF ;');
        g.parse('main : null ;');
        g.parse('main : true ;');
        g.parse('main\n:\nfalse\n;');
        g.parse('main : \'hod\\nor\' ;');
        g.parse('main : \'hodor\\u{B4B3}\' ;');
        g.parse('main : well then this is a cool word ;');
        g.parse('main : (ab-aabb) ;');
        g.parse('main : (a-) ;');
        g.parse('main : ->hello ;');
        g.parse('main : <-hello ;');
        g.parse('main : @hello ;');
    });

    it('should parse aggregate terms', function() {
        g.parse('main : [ ] ;');
        g.parse('main : { } ;');
        g.parse('main : [ 1 2 3 ] ;');
        g.parse('main : { name : my name is hodor } ;');
        g.parse('main : [ 3 2 1 [ 1 2 3 ] ] ;');
        g.parse('main : { name : { hello : 2 } cat , id : 1 } ;')
    });

    it('should parse multiple definitions', function() {
        g.parse('main : -hello- ; -hello- : 1 2 3 4 5 ;');
        g.parse('main : why? ; why? : because ;');
    });
})
