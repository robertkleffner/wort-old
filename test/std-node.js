var should = require('chai').should(),
    std = require('../lib/std-node');

describe('#std', function() {
    it('should annihilate the stack', function() {
        var stack = [];
        std.exec([2, "hello"], stack);
        stack.should.have.length(2);

        std.annihilate(stack);
        stack.should.have.length(0);
    });

    it('should execute a quotation', function() {
        var stack = [];
        std.exec([2, "hello", function(stack) { stack.pop(); }], stack);
        stack.should.have.length(1);
        stack[0].should.equal(2);
    });

    it('should push a null value on the stack', function() {
        var stack = [];

        std.null(stack);
        stack.should.have.length(1);
        should.not.exist(stack[0]);
    });

    it('should push boolean values on the stack', function() {
        var stack = [];

        std.true(stack);
        std.false(stack);
        stack.should.have.length(2);
        stack[0].should.equal(true);
        stack[1].should.equal(false);
    });

    it('should work with the eight basic combinators', function() {
        var stack = [2];

        std.zap(stack);
        stack.should.have.length(0);

        stack = [2];
        std.dup(stack);
        stack.should.have.length(2);
        stack[0].should.equal(stack[1]);

        stack = [2,3];
        std.swap(stack);
        stack[0].should.equal(3);
        stack[1].should.equal(2);

        stack = [[2],[3]];
        std.cat(stack);
        stack.should.have.length(1);
        stack[0].should.have.length(2);
        stack[0][0].should.equal(2);
        stack[0][1].should.equal(3);

        stack = [2, [3]];
        std.cons(stack);
        stack.should.have.length(1);
        stack[0].should.have.length(2);
        stack[0][0].should.equal(2);
        stack[0][1].should.equal(3);

        stack = [2];
        std.unit(stack);
        stack.should.have.length(1);
        stack[0].should.have.length(1);
        stack[0][0].should.equal(2);

        stack = [[2]];
        std.i(stack);
        stack.should.have.length(1);
        stack[0].should.equal(2);

        stack = [3, [4]];
        std.dip(stack);
        stack.should.have.length(2);
        stack[0].should.equal(4);
        stack[1].should.equal(3);
    });

    it('should perform arithmetic', function() {
        var stack = [1,2];
        std.add(stack);
        stack[0].should.equal(3);

        stack = [4,1];
        std.sub(stack);
        stack[0].should.equal(3);

        stack = [2,5];
        std.mul(stack);
        stack[0].should.equal(10);

        stack = [4,2];
        std.div(stack);
        stack[0].should.equal(2);

        stack = [5,3];
        std.rem(stack);
        stack[0].should.equal(2);

        stack = [4];
        std.inc(stack);
        stack[0].should.equal(5);

        stack = [4];
        std.dec(stack);
        stack[0].should.equal(3);

        stack = [3];
        std.neg(stack);
        stack[0].should.equal(-3);
    });

    it('should perform valid bitwise arithmetic', function() {
        var stack = [2];
        std.complement(stack);
        stack[0].should.equal(-3);

        stack = [2,2,4,2];
        std.band(stack);
        stack[2].should.equal(0);
        std.zap(stack);
        std.band(stack);
        stack[0].should.equal(2);

        stack = [1,4];
        std.bor(stack);
        stack[0].should.equal(5);

        stack = [3, 1];
        std.xor(stack);
        stack[0].should.equal(2);

        stack = [2,1];
        std.shl(stack);
        stack[0].should.equal(4);

        stack = [-4,1];
        std.shr(stack);
        stack[0].should.equal(-2);

        stack = [-4,1];
        std.shr_u(stack);
        stack[0].should.equal(2147483646);
    });

    it('should perform valid boolean logic', function() {
        var stack = [true,false,true,true];
        std.and(stack);
        stack[2].should.equal(true);
        std.zap(stack);
        std.and(stack);
        stack[0].should.equal(false);

        var stack = [true,false,false,false];
        std.or(stack);
        stack[2].should.equal(false);
        std.zap(stack);
        std.or(stack);
        stack[0].should.equal(true);

        var stack = [false];
        std.not(stack);
        stack[0].should.equal(true);
    });

    it('should do object access correctly', function() {
        var stack = [2, {}, "hodor"];
        std.setvalobj(stack);
        stack.should.have.length(1);
        stack[0].hodor.should.equal(2);

        stack = [{}, 2, "hodor"];
        std.setobjval(stack);
        stack.should.have.length(1);
        stack[0].hodor.should.equal(2);

        stack = [{hodor: 2}, "hodor"];
        std.getprop(stack);
        stack.should.have.length(2);
        stack[1].should.equal(2);
    });

    it('should answer type questions correctly', function() {
        var stack = [null];
        std.null$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        var stack = [true, 'boolean'];
        std.typeof$(stack);
        stack.should.have.length(3);
        stack[2].should.equal(true);

        stack = [[2]];
        std.quotation$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = ['hodor'];
        std.string$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [2];
        std.number$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [false];
        std.boolean$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [{}];
        std.object$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [[]];
        std.object$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(false);
    });

    it('should perform object utilities correctly', function() {
        var stack = [{}];
        std.freeze(stack);
        std.frozen$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [{}];
        std.seal(stack);
        std.sealed$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [{}];
        std.stagnate(stack);
        std.stagnant$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        std.zap(stack);
        std.extensible$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(false);
    });

    it('should perform collection utilities correctly', function() {
        var stack = [[]];
        std.empty$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [[2,3],1];
        std.truncate(stack);
        stack.should.have.length(1);
        stack[0].should.have.length(1);
    });
});
