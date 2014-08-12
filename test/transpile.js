var should = require('chai').should(),
    l = require('../lib/lex'),
    p = require('../lib/parse'),
    s = require('../lib/semantics'),
    transpile = require('../lib/transpile');

describe('#transpile', function() {
    it('should return an empty module for empty input', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex(''), 'hodor')));
        res.should.equal('module.exports = (function() {\n})();\n');
    });

    it('should emit require statements', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('require "test" as t;'), 'hodor')));
        res.should.equal('var t = require("test");\nmodule.exports = (function() {\n})();\n');
    });

    it('should emit a simple public definition', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: 2;'), 'hodor')));
        res.should.equal('module.exports = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstack.push(2);\n};\nreturn $0;\n})();\n');
    });

    it('should emit a public and private definition', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('test: "hello"; Test: 2;'), 'hodor')));
        res.should.equal('module.exports = (function() {\nvar $0 = {};\nfunction test(stack) {\nstack.push("hello");\n}\n' +
            '$0.Test = function(stack) {\nstack.push(2);\n};\nreturn $0;\n})();\n');
    });

    it('should emit an object literal', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: {test: "hello"};'), 'hodor')));
        res.should.equal('module.exports = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstack.push({test: "hello"});\n};\nreturn $0;\n})();\n');
    });

    it('should emit inline javascript', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: ~~~ console.log("hodor!") ~~~;'), 'hodor')));
        res.should.equal('module.exports = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\n console.log("hodor!") \n};\nreturn $0;\n})();\n');
    });

    it('should emit operators', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: +;'), 'hodor')));
        res.should.equal('module.exports = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstd.add(stack);\n};\nreturn $0;\n})();\n');
    });

    it('should emit built in functions', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: dup;'), 'hodor')));
        res.should.equal('var std = require("wort");\nmodule.exports = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstd.Dup(stack);\n};\nreturn $0;\n})();\n');
    });

    it('should emit property accessors', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: ->hodor;'), 'hodor')));
        res.should.equal('module.exports = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstd.setvalobj(stack, "hodor");\n};\nreturn $0;\n})();\n');
    });

    it('should emit user defined words', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('test: 2; Test: test;'), 'hodor')));
        res.should.equal('module.exports = (function() {\nvar $0 = {};\nfunction test(stack) {\nstack.push(2);\n}\n$0.Test = function(stack) {\ntest(stack);\n};\nreturn $0;\n})();\n');
    });

    it('should emit quotations', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: [2];'), 'hodor')));
        res.should.equal('module.exports = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstack.push([2]);\n};\nreturn $0;\n})();\n');
    });

    it('should call public Main if present', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Main: 2;'), 'hodor')));
        res.should.equal('var $1 = (function() {\nvar $0 = {};\n$0.Main = function(stack) {\nstack.push(2);\n};\nreturn $0;\n})();\n$1.Main([]);\n');
    });
});
