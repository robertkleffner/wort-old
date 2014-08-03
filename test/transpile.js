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
        res.should.equal('var std = require("wort-std");\nvar hodor = (function() {\n})();\nmodule.exports = hodor;');

        var res = transpile.transpile(s.analyze(p.parse(l.lex(''), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\n})();');
    });

    it('should emit correct headers for sub modules', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('module test.hodor;'))), transpile.targets.BROWSER);
        res.should.equal('var test = test || {};\ntest.hodor = (function() {\n})();');
    });

    it('should emit require statements for node js', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('require "test" as t;'), 'hodor')), transpile.targets.NODE);
        res.should.equal('var std = require("wort-std");\nvar t = require("test");\nvar hodor = (function() {\n})();\nmodule.exports = hodor;')
    });

    it('should emit a simple public definition', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Main: 2;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Main = function(stack) {\nstack[++std.ind] = 2;\n};\nreturn $0;\n})();')
    });

    it('should emit a public and private definition', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('test: "hello"; Main: 2;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\nfunction test(stack) {\nstack[++std.ind] = "hello";\n}\n' +
            '$0.Main = function(stack) {\nstack[++std.ind] = 2;\n};\nreturn $0;\n})();')
    });

    it('should emit an object literal', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Main: {test: "hello"};'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Main = function(stack) {\nstack[++std.ind] = {test: "hello"};\n};\nreturn $0;\n})();')
    });

    it('should emit inline javascript', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Main: ~~~ console.log("hodor!") ~~~;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Main = function(stack) {\n console.log("hodor!") ;\n};\nreturn $0;\n})();')
    });

    it('should emit operators', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Main: +;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Main = function(stack) {\nstd.add(stack);\n};\nreturn $0;\n})();')
    });

    it('should emit built in functions', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Main: dup;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Main = function(stack) {\nstd.dup(stack);\n};\nreturn $0;\n})();');
    });

    it('should emit property accessors', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Main: ->hodor;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Main = function(stack) {\nstd.setvalobj(stack, "hodor");\n};\nreturn $0;\n})();')
    });

    it('should emit user defined words', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('test: 2; Main: test;'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\nfunction test(stack) {\nstack[++std.ind] = 2;\n}\n$0.Main = function(stack) {\ntest(stack);\n};\nreturn $0;\n})();')
    });

    it('should emit quotations', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('Main: [2];'), 'hodor')), transpile.targets.BROWSER);
        res.should.equal('var hodor = (function() {\nvar $0 = {};\n$0.Main = function(stack) {\nstack[++std.ind] = [2,];\n};\nreturn $0;\n})();')
    });
});
