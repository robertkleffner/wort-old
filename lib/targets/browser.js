module.exports = {
    transpile: function(mod, name) {
        var output = this.emitHeader(name);

        output += this.emitImports(mod.imports);

        output += this.emitFooter();
        return output;
    },

    emitImports: function(imports) {
        for (var i = 0; i < imports.length; i++) {
            output += '    var ' + imports[i].alias + ' = $$.' + imports[i].name + ';\n';
        }
        return output;
    },

    emitHeader: function(name) {
        var output = '';
        var subs = name.split('.');
        var first = true;

        while (subs.length > 1) {
            if (first) {
                output += 'var ';
                first = false;
            }
            output += subs[0] + ' = ' + subs[0] + ' || {};\n';
            subs.unshift(subs.shift() + '.' + subs.shift());
        }

        if (first) {
            output += 'var ';
        }

        output += subs[0] + ' = (function($$) {\n    var $0 = {};\n';
        return output;
    },

    emitFooter: function() {
        return '    return $0;\n})(window);';
    }
}
