module.exports = {
    transpile: function(mod, name) {
        var output = this.emitHeader();

        output += this.emitImports(name, mod.imports);

        output += this.emitFooter();
        return output;
    },

    emitImports: function(imports) {
        var levels = name.split('.').length;
        var prefix = (levels == 0) ? './' : Array(levels + 1).join('../');
        var output = '    var std = require("' + prefix + 'std")';
        for (var i = 0; i < imports.length; i++) {
            output += '    var ' + imports[i].alias + ' = require("' + prefix + imports[i].name.replace('.', '/') + '");\n';
        }
        return output;
    },

    emitHeader: function() {
        return 'module.exports = (function() {\n    var $0 = {};\n';
    },

    emitFooter: function() {
        return '    return $0;\n})();';
    }
};
