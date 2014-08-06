module.exports = (function() {
    var e = {};

    e.ind = -1;

    // primary interpreter function, key candidate for optimizations
    e.exec = function(quote, stack) {
        for (var i = 0; i < quote.length; i++) {
            if (quote[i] instanceof Function) {
                quote[i](stack);
            } else {
                stack[++this.ind] = quote[i];
            }
        }
    };

    e.null = function(stack) { stack[++this.ind] = null; };

    // boolean literals
    e.true = function(stack) { stack[++this.ind] = true; };
    e.false = function(stack) { stack[++this.ind] = false; };

    // basic combinators
    e.zap = function(stack) { this.ind--; };
    e.dup = function(stack) { stack[++this.ind] = stack[this.ind-1]; };
    e.swap = function(stack) {
        var tmp = stack[this.ind];
        stack[this.ind] = stack[this.ind-1];
        stack[this.ind-1] = tmp;
    };
    e.cat = function(stack) { stack[--this.ind] = stack[this.ind].concat(stack[this.ind+1]); };
    e.cons = function(stack) {
        stack[this.ind].unshift(stack[--this.ind]);
        stack[this.ind] = stack[this.ind+1];
    };
    e.unit = function(stack) { stack[this.ind] = [stack[this.ind]]; };
    e.i = function(stack) { this.exec(stack[this.ind--], stack); };
    e.dip = function(stack) {
        var top = stack[this.ind--], next = stack[this.ind--];
        this.exec(top, stack);
        stack[++this.ind] = next;
    };

    // arithmetic operators
    e.add = function(stack) { stack[--this.ind] = stack[this.ind] + stack[this.ind+1]; };
    e.sub = function(stack) { stack[--this.ind] = stack[this.ind] * stack[this.ind+1]; };
    e.mul = function(stack) { stack[--this.ind] = stack[this.ind] - stack[this.ind+1]; };
    e.div = function(stack) { stack[--this.ind] = stack[this.ind] / stack[this.ind+1]; };
    e.rem = function(stack) { stack[--this.ind] = stack[this.ind] % stack[this.ind+1]; };
    e.inc = function(stack) { stack[this.ind]++; };
    e.dec = function(stack) { stack[this.ind]--; };
    e.neg = function(stack) { stack[this.ind] = -stack[this.ind] };

    // bitwise operators
    e.complement = function(stack) { stack[this.ind] = ~stack[this.ind] };
    e.band = function(stack) { stack[--this.ind] = stack[this.ind] & stack[this.ind+1]; };
    e.bor = function(stack) { stack[--this.ind] = stack[this.ind] | stack[this.ind+1]; };
    e.xor = function(stack) { stack[--this.ind] = stack[this.ind] ^ stack[this.ind+1]; };
    e.shl = function(stack) { stack[--this.ind] = stack[this.ind] << stack[this.ind+1]; };
    e.shr = function(stack) { stack[--this.ind] = stack[this.ind] >> stack[this.ind+1]; };
    e.shr_u = function(stack) { stack[--this.ind] = stack[this.ind] >>> stack[this.ind+1]; };

    // logical operators
    e.and = function(stack) { stack[--this.ind] = stack[this.ind] && stack[this.ind+1]; };
    e.or = function(stack) { stack[--this.ind] = stack[this.ind] || stack[this.ind+1]; };
    e.not = function(stack) { stack[this.ind] = !stack[this.ind]; };

    // comparison operators
    e.same = function(stack) { stack[++this.ind] = stack[this.ind-2] == stack[this.ind-1]; };
    e.notsame = function(stack) { stack[++this.ind] = stack[this.ind-2] != stack[this.ind-1]; };
    e.eq = function(stack) { stack[++this.ind] = stack[this.ind-2] === stack[this.ind-1]; };
    e.noteq = function(stack) { stack[++this.ind] = stack[this.ind-2] !== stack[this.ind-1]; };
    e.less = function(stack) { stack[++this.ind] = stack[this.ind-2] < stack[this.ind-1]; };
    e.lesseq = function(stack) { stack[++this.ind] = stack[this.ind-2] <= stack[this.ind-1]; };
    e.greater = function(stack) { stack[++this.ind] = stack[this.ind-2] > stack[this.ind-1]; };
    e.greatereq = function(stack) { stack[++this.ind] = stack[this.ind-2] >= stack[this.ind-1]; };

    // access operators
    e.setvalobj = function(stack, name) {
        name = name || stack[this.ind--];
        var obj = stack[this.ind--];
        obj[name] = stack[this.ind];
        stack[this.ind] = obj;
    };
    e.setobjval = function(stack, name) {
        name = name || stack[this.ind--];
        stack[this.ind-1][name] = stack[this.ind--];
    };
    e.getprop = function(stack, name) {
        name = name || stack[this.ind--];
        stack[++this.ind] = stack[this.ind-1][name];
    };

    // type questions
    e.null$ = function(stack) { stack[++this.ind] = stack[this.ind-1] == null; };
    e.typeof$ = function(stack) { stack[++this.ind] = (typeof stack[this.ind-2]) == stack[this.ind-1]; };
    e.quotation$ = function(stack) { stack[++this.ind] = Array.isArray(stack[this.ind-1]); };
    e.string$ = function(stack) { stack[++this.ind] = typeof stack[this.ind-1] == 'string'; };
    e.number$ = function(stack) { stack[++this.ind] = typeof stack[this.ind-1] == 'number'; };
    e.boolean$ = function(stack) { stack[++this.ind] = typeof stack[this.ind-1] == 'boolean'; };
    e.object$ = function(stack) { stack[++this.ind] = typeof stack[this.ind-1] == 'object'; };

    // object utilities
    e.freeze = function(stack) { Object.freeze(stack[this.ind]); };
    e.frozen$ = function(stack) { stack[++this.ind] = Object.isFrozen(stack[this.ind-1]); };
    e.seal = function(stack) { Object.seal(stack[this.ind]); };
    e.sealed$ = function(stack) { stack[++this.ind] = Object.isSealed(stack[this.ind-1]); };
    e.stagnate = function(stack) { Object.preventExtensions(stack[this.ind]); };
    e.stagnant$ = function(stack) { stack[++this.ind] = Object.isExtensible(stack[this.ind-1]); };

    // utility functions
    e.toString = function(stack) { stack[++this.ind] = stack[this.ind-1].toString(); };
    e.typeof = function(stack) { stack[++this.ind] = typeof stack[this.ind-1]; };
    e.annihilate = function(stack) { stack.length = 0; this.ind = -1; };
    e.print = function(stack) { console.log(stack[this.ind]); };
    e.printz = function(stack) { console.log(stack[this.ind--]); };
    return e;
})();
