var should = require('chai').should(),
    l = require('../lib/lex'),
    p = require('../lib/parse'),
    s = require('../lib/semantics'),
    transpile = require('../lib/transpile');

describe('#transpile', function() {
    it('should bug out without a specified target', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex(''))));
        res.should.equal('Must specify a transpile target');
    });

    it('should return an empty module for empty input', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex(''), 'hodor')), transpile.targets.NODE);
        res.should.equal('var std = require("wort");\nvar hodor = (function() {\n})();\nmodule.exports = hodor;\n');

        var res = transpile.transpile(s.analyze(p.parse(l.lex(''), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\n})();\n');
    });

    it('should emit correct headers for sub modules', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('module test.hodor;'))), transpile.targets.BROWSER);
        res.should.equal('var test = test || {};\ntest.hodor = (function() {\n})();\n');
    });

    it('should emit require statements for node js', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('require "test" as t;'), 'hodor')), transpile.targets.NODE);
        res.should.equal('var std = require("wort");\nvar t = require("test");\nvar hodor = (function() {\n})();\nmodule.exports = hodor;\n')
    });

    it('should emit a simple public definition', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: 2;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstack.push(2);\n};\nreturn $0;\n})();\n')
    });

    it('should emit a public and private definition', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('test: "hello"; Test: 2;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\nfunction test(stack) {\nstack.push("hello");\n}\n' +
            '$0.Test = function(stack) {\nstack.push(2);\n};\nreturn $0;\n})();\n')
    });

    it('should emit an object literal', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: {test: "hello"};'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstack.push({test: "hello"});\n};\nreturn $0;\n})();\n')
    });

    it('should emit inline javascript', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: ~~~ console.log("hodor!") ~~~;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\n console.log("hodor!") ;\n};\nreturn $0;\n})();\n')
    });

    it('should emit operators', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: +;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstd.add(stack);\n};\nreturn $0;\n})();\n')
    });

    it('should emit built in functions', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: dup;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstd.dup(stack);\n};\nreturn $0;\n})();\n');
    });

    it('should emit property accessors', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: ->hodor;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstd.setvalobj(stack, "hodor");\n};\nreturn $0;\n})();\n')
    });

    it('should emit user defined words', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('test: 2; Test: test;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\nfunction test(stack) {\nstack.push(2);\n}\n$0.Test = function(stack) {\ntest(stack);\n};\nreturn $0;\n})();\n')
    });

    it('should emit quotations', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Test: [2];'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Test = function(stack) {\nstack.push([2]);\n};\nreturn $0;\n})();\n')
    });

    it('should call public Main if present', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Main: 2;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Main = function(stack) {\nstack.push(2);\n};\nreturn $0;\n})();\nhodor.Main([]);\n');

        res = transpile.transpile(s.analyze(p.parse(l.lex('Main: 2;'), 'hodor')), transpile.targets.NODE);
        res.should.equal('var std = require("wort");\nvar hodor = (function() {\nvar $0 = {};\n$0.Main = function(stack) {\nstack.push(2);\n};\nreturn $0;\n})();\nhodor.Main([]);\n');
    });
});
