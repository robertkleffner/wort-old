var lex = require('./lex');

module.exports = {

    targets: {
        NODE: 0,
        BROWSER: 1
    },

    node: {
        header: 'var m = (function() {\n',
        footer: '})();\nexports.module = m;'
    },

    transpile: function(mod, name, target) {
        if (!target) {
            return this.transpileNode(mod, name);
        }

        if (target == this.targets.NODE) {
            return this.transpileNode(mod, name);
        } else {
            return this.transpileBrowser(mod, name);
        }
    },

    transpileNode: function(mod, name) {
        var output = this.node.header;

        output += this.node.footer;
        return output;
    },

    transpileBrowser: function(mod, name) {
        var output = this.emitBrowserHeader(name);

        output += '})(this);';
        return output;
    },

    emitBrowserHeader: function(name) {
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

        output += subs[0] + ' = (function($$) {\n';
        return output;
    }
};
