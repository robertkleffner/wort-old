var should = require('chai').should(),
    l = require('../lib/lex'),
    p = require('../lib/parse'),
    s = require('../lib/semantics'),
    transpile = require('../lib/transpile');

describe('#transpile', function() {
    it('should return an empty module for empty input', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex(''), 'hodor')));
        res.toString().should.equal('module.exports = (function() {})();');
    });

    it('should emit require statements', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('require "test" as t;'), 'hodor')));
        res.toString().should.equal('var t = require("test");module.exports = (function() {})();');
    });

    it('should emit a simple public definition', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: 2;'), 'hodor')));
        res.toString().should.equal('module.exports = (function() {var $0 = {};$0.Test = function(stack) {stack.push(2);};return $0;})();');
    });

    it('should emit a public and private definition', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('-test: "hello"; test: 2;'), 'hodor')));
        res.toString().should.equal('module.exports = (function() {var $0 = {};function _test(stack) {stack.push("hello");}' +
            '$0.test = function(stack) {stack.push(2);};return $0;})();');
    });

    it('should emit an object literal', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: {test: "hello"};'), 'hodor')));
        res.toString().should.equal('module.exports = (function() {var $0 = {};$0.Test = function(stack) {stack.push({test: "hello"});};return $0;})();');
    });

    it('should emit inline javascript', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: ~~~ console.log("hodor!") ~~~;'), 'hodor')));
        res.toString().should.equal('module.exports = (function() {var $0 = {};$0.Test = function(stack) { console.log("hodor!") };return $0;})();');
    });

    it('should emit operators', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: +;'), 'hodor')));
        res.toString().should.equal('var std = require("wort");module.exports = (function() {var $0 = {};$0.Test = function(stack) {std.Add(stack);};return $0;})();');
    });

    it('should emit built in functions', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: dup;'), 'hodor')));
        res.toString().should.equal('var std = require("wort");module.exports = (function() {var $0 = {};$0.Test = function(stack) {std.Dup(stack);};return $0;})();');
    });

    it('should emit property accessors', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: ->hodor;'), 'hodor')));
        res.toString().should.equal('var std = require("wort");module.exports = (function() {var $0 = {};$0.Test = function(stack) {std.Setvalobj(stack, "hodor");};return $0;})();');
    });

    it('should emit user defined words', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('-test: 2; test: -test;'), 'hodor')));
        res.toString().should.equal('module.exports = (function() {var $0 = {};function _test(stack) {stack.push(2);}$0.test = function(stack) {_test(stack);};return $0;})();');
    });

    it('should emit quotations', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: [2];'), 'hodor')));
        res.toString().should.equal('module.exports = (function() {var $0 = {};$0.Test = function(stack) {stack.push([2]);};return $0;})();');

        res = transpile.transpile(s.analyze(p.parse(l.lex('test: [dup];'), 'hodor')));
        res.toString().should.equal('var std = require("wort");module.exports = (function() {var $0 = {};$0.test = function(stack) {stack.push([std.Dup]);};return $0;})();')
    });

    it('should emit stack shuffle operations', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('test: (ab-ba);'), 'hodor')));
        res.toString().should.equal('module.exports = (function() {var $0 = {};function $shuffle0(stack) {' +
            'var b = stack.pop();var a = stack.pop();stack.push(b);stack.push(a);' +
            '}$0.test = function(stack) {$shuffle0(stack);};return $0;})();');
    });

    it('should call public main if present', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('main: 2;'), 'hodor')));
        res.toString().should.equal('var $1 = (function() {var $0 = {};$0.main = function(stack) {stack.push(2);};return $0;})();$1.main([]);');
    });
});
