var should = require('chai').should(),
    l = require('../lib/lex'),
    p = require('../lib/parse'),
    s = require('../lib/semantics'),
    transpile = require('../lib/transpile');

describe('#transpile', function() {
    it('should bug out without a specified target', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex(''))), 'hodor');
        res.should.equal('Must specify a transpile target');
    });

    it('should return an empty module for empty input', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex(''))), 'hodor', transpile.targets.NODE);
        res.should.equal('module.exports = (function() {\n    var $0 = {};\n    return $0;\n})();');

        var res = transpile.transpile(s.analyze(p.parse(l.lex(''))), 'hodor', transpile.targets.BROWSER);
        res.should.equal('var hodor = (function($$) {\n    var $0 = {};\n    return $0;\n})(window);');
    });
});

describe('#transpile for browser', function() {
    it('should name the module named correctly for the browser', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex(''))), 'hodor.hodor.hodor', transpile.targets.BROWSER);
        res.should.equal('var hodor = hodor || {};\nhodor.hodor = hodor.hodor || {};\nhodor.hodor.hodor = (function($$) {\n    var $0 = {};\n    return $0;\n})(window);')
    });

    it('should have aliased imports for the browser', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('import hodor;'))), 'test', transpile.targets.BROWSER);
        res.should.equal('var test = (function($$) {\n    var $0 = {};\n    var $1 = $$.hodor;\n    return $0;\n})(window);');
    });

    it('should transpile a private function', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('main: 2;'))), 'test', transpile.targets.BROWSER);
        res.should.equal('var test = (function($$) {\n    var $0 = {};\n    function main(stack) {\n    stack[++std.ind] = 2;\n}\n    return $0;\n})(window);')
    });
});

describe('#transpile for node', function() {
    it('should have aliased imports for node', function() {
        var res = transpile.transpile(s.analyze(p.parse(l.lex('import hodor;'))), 'test', transpile.targets.NODE);
        res.should.equal('module.exports = (function() {\n    var $0 = {};\n    var $1 = require("./hodor");\n    return $0;\n})();');
    });

    it('should have relative imports for node', function() {
        
    });
});
