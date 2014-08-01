var lex = require('./lex'),
    node = require('./targets/node'),
    browser = require('./targets/browser');

module.exports = {

    targets: {
        NODE: 0,
        BROWSER: 1
    },

    targetArray: [
        node,
        browser
    ],

    transpile: function(mod, name, target) {
        if (typeof target == 'undefined') {
            return 'Must specify a transpile target';
        }

        return this.targetArray[target].transpile(mod, name);
    }
};
