var should = require('chai').should(),
    l = require('../lib/lex'),
    p = require('../lib/parse'),
    s = require('../lib/semantics'),
    transpile = require('../lib/transpile');

describe('#transpile', function() {
    it('should have a default target for node', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex(''))), 'hodor');
        res.should.equal('var m = (function() {\n})();\nexports.module = m;');
    });

    it('should return an empty module for empty input', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex(''))), 'hodor', transpile.targets.NODE);
        res.should.equal('var m = (function() {\n})();\nexports.module = m;');

        var res = transpile.transpile(s.analyze(p.parse(l.lex(''))), 'hodor', transpile.targets.BROWSER);
        res.should.equal('var hodor = (function($$) {\n})(this);');
    });

    it('should name the module correctly for the browser', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex(''))), 'hodor.hodor.hodor', transpile.targets.BROWSER);
        res.should.equal('var hodor = hodor || {};\nhodor.hodor = hodor.hodor || {};\nhodor.hodor.hodor = (function($$) {\n})(this);')
    });

    it('should have aliased imports for the browser', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('import hodor;'))), 'test', transpile.targets.BROWSER);
        //res.should.equal('var test = (function($$) {\nvar $1 = $$.hodor;\n})(this);');
    });

    it('should have aliased imports for node', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('import hodor;'))), 'test', transpile.targets.BROWSER);
        //res.should.equal('var m = (function() {\nvar $1 = require("./hodor");\n})();\nexports.modules = m;');
    });
});
