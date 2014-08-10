module.exports = (function() {
    var e = {};

    e.ind = -1;

    // primary interpreter function, key candidate for optimizations
    e.exec = function(quote, stack) {
        for (var i = 0; i < quote.length; i++) {
            if (quote[i] instanceof Function) {
                quote[i](stack);
            } else {
                stack.push(quote[i]);
            }
        }
    };

    e.null = function(stack) { stack.push(null); };

    // boolean literals
    e.true = function(stack) { stack.push(true); };
    e.false = function(stack) { stack.push(false); };

    // basic combinators
    e.zap = function(stack) { stack.pop(); };
    e.dup = function(stack) { stack.push(stack[stack.length-1]); };
    e.swap = function(stack) {
        var tmp = stack[stack.length-1];
        stack[stack.length-1] = stack[stack.length-2];
        stack[stack.length-2] = tmp;
    };
    e.cat = function(stack) { var top = stack.pop(); stack.push(stack.pop().concat(top)); };
    e.cons = function(stack) { var next = stack.pop(); next.unshift(stack.pop()); stack.push(next); };
    e.unit = function(stack) { stack[stack.length-1] = [stack[stack.length-1]]; };
    e.i = function(stack) { this.exec(stack.pop(), stack); };
    e.dip = function(stack) {
        var top = stack.pop(), next = stack.pop();
        this.exec(top, stack);
        stack.push(next);
    };

    // arithmetic operators
    e.add = function(stack) { stack.push(stack.pop() + stack.pop()); };
    e.sub = function(stack) { var top = stack.pop(); stack.push(stack.pop() - top); };
    e.mul = function(stack) { stack.push(stack.pop() * stack.pop()); };
    e.div = function(stack) { var top = stack.pop(); stack.push(stack.pop() / top); };
    e.rem = function(stack) { var top = stack.pop(); stack.push(stack.pop() % top); };
    e.inc = function(stack) { stack[stack.length-1]++; };
    e.dec = function(stack) { stack[stack.length-1]--; };
    e.neg = function(stack) { stack[stack.length-1] = -stack[stack.length-1] };

    // bitwise operators
    e.complement = function(stack) { stack[stack.length-1] = ~stack[stack.length-1] };
    e.band = function(stack) { stack.push(stack.pop() & stack.pop()); };
    e.bor = function(stack) { stack.push(stack.pop() | stack.pop()); };
    e.xor = function(stack) { stack.push(stack.pop() ^ stack.pop()); };
    e.shl = function(stack) { var top = stack.pop(); stack.push(stack.pop() << top); };
    e.shr = function(stack) { var top = stack.pop(); stack.push(stack.pop() >> top); };
    e.shr_u = function(stack) { var top = stack.pop(); stack.push(stack.pop() >>> top); };

    // logical operators
    e.and = function(stack) { var top = stack.pop(); stack.push(stack.pop() && top); };
    e.or = function(stack) { var top = stack.pop(); stack.push(stack.pop() || top); };
    e.not = function(stack) { stack[stack.length-1] = !stack[stack.length-1]; };

    // comparison operators
    e.same = function(stack) { stack.push(stack[stack.length-2] == stack[stack.length-1]); };
    e.notsame = function(stack) { stack.push(stack[stack.length-2] != stack[stack.length-1]); };
    e.eq = function(stack) { stack.push(stack[stack.length-2] === stack[stack.length-1]); };
    e.noteq = function(stack) { stack.push(stack[stack.length-2] !== stack[stack.length-1]); };
    e.less = function(stack) { stack.push(stack[stack.length-2] < stack[stack.length-1]); };
    e.lesseq = function(stack) { stack.push(stack[stack.length-2] <= stack[stack.length-1]); };
    e.greater = function(stack) { stack.push(stack[stack.length-2] > stack[stack.length-1]); };
    e.greatereq = function(stack) { stack.push(stack[stack.length-2] >= stack[stack.length-1]); };

    // access operators
    e.setvalobj = function(stack, name) {
        name = name || stack.pop();
        var obj = stack.pop();
        obj[name] = stack.pop();
        stack.push(obj);
    };
    e.setobjval = function(stack, name) {
        name = name || stack.pop();
        stack[stack.length-2][name] = stack.pop();
    };
    e.getprop = function(stack, name) {
        name = name || stack.pop();
        stack.push(stack[stack.length-1][name]);
    };

    // type questions
    e.null$ = function(stack) { stack.push(stack[stack.length-1] == null); };
    e.typeof$ = function(stack) { stack.push((typeof stack[stack.length-2]) == stack[stack.length-1]); };
    e.quotation$ = function(stack) { stack.push(Array.isArray(stack[stack.length-1])); };
    e.string$ = function(stack) { stack.push(typeof stack[stack.length-1] == 'string'); };
    e.number$ = function(stack) { stack.push(typeof stack[stack.length-1] == 'number'); };
    e.boolean$ = function(stack) { stack.push(typeof stack[stack.length-1] == 'boolean'); };
    e.object$ = function(stack) { stack.push((typeof stack[stack.length-1] == 'object') && !Array.isArray(stack[stack.length-1])); };

    // object utilities
    e.freeze = function(stack) { Object.freeze(stack[stack.length-1]); };
    e.frozen$ = function(stack) { stack.push(Object.isFrozen(stack[stack.length-1])); };
    e.seal = function(stack) { Object.seal(stack[stack.length-1]); };
    e.sealed$ = function(stack) { stack.push(Object.isSealed(stack[stack.length-1])); };
    e.stagnate = function(stack) { Object.preventExtensions(stack[stack.length-1]); };
    e.stagnant$ = function(stack) { stack.push(Object.isExtensible(stack[stack.length-1]) === false); };
    e.extensible$ = function(stack) { stack.push(Object.isExtensible(stack[stack.length-1])); };

    // collection utilities
    e.empty$ = function(stack) { stack.push(stack[stack.length-1].length === 0); };
    e.in = function(stack) { stack.push(stack.pop().indexOf(stack.pop()) !== -1); };
    e.has = function(stack) { var top = stack.pop(); stack.push(stack.pop().indexOf(top) !== -1); };
    e.at = function(stack) { stack.push(stack[stack.length-2][stack.pop()]); };
    // TODO: splice, reverse, flatten, sort

    // stack utilities
    e.annihilate = function(stack) { stack.length = 0; };
    e.gather = function(stack) { var amount = stack.pop(); stack.push(stack.splice(stack.length-amount-1,amount)); };
    e.spread = function(stack) { var arr = stack.pop(); stack = stack.concat(arr); };
    e.substitute = function(stack) { stack = stack.pop(); };

    // utility functions
    e.toString = function(stack) { stack.push(stack[stack.length-1].toString()); };
    e.typeof = function(stack) { stack.push(typeof stack[stack.length-1]); };
    e.print = function(stack) { console.log(stack[stack.length-1]); };
    e.printz = function(stack) { console.log(stack.pop()); };
    return e;
})();
