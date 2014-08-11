var should = require('chai').should(),
    std = require('../lib/std.wort.js');

describe('#std', function() {
    it('should annihilate the stack', function() {
        var stack = [];
        stack.push(2, "hello");
        stack.should.have.length(2);

        std.Annihilate(stack);
        stack.should.have.length(0);
    });

    it('should push a null value on the stack', function() {
        var stack = [];

        std.Null(stack);
        stack.should.have.length(1);
        should.not.exist(stack[0]);
    });

    it('should push boolean values on the stack', function() {
        var stack = [];

        std.True(stack);
        std.False(stack);
        stack.should.have.length(2);
        stack[0].should.equal(true);
        stack[1].should.equal(false);
    });

    it('should work with the eight basic combinators', function() {
        var stack = [2];

        std.Zap(stack);
        stack.should.have.length(0);

        stack = [2];
        std.Dup(stack);
        stack.should.have.length(2);
        stack[0].should.equal(stack[1]);

        stack = [2,3];
        std.Swap(stack);
        stack[0].should.equal(3);
        stack[1].should.equal(2);

        stack = [[2],[3]];
        std.Cat(stack);
        stack.should.have.length(1);
        stack[0].should.have.length(2);
        stack[0][0].should.equal(2);
        stack[0][1].should.equal(3);

        stack = [2, [3]];
        std.Cons(stack);
        stack.should.have.length(1);
        stack[0].should.have.length(2);
        stack[0][0].should.equal(2);
        stack[0][1].should.equal(3);

        stack = [2];
        std.Unit(stack);
        stack.should.have.length(1);
        stack[0].should.have.length(1);
        stack[0][0].should.equal(2);

        stack = [[2]];
        std.I(stack);
        stack.should.have.length(1);
        stack[0].should.equal(2);

        stack = [3, [4]];
        std.Dip(stack);
        stack.should.have.length(2);
        stack[0].should.equal(4);
        stack[1].should.equal(3);
    });

    it('should perform arithmetic', function() {
        var stack = [1,2];
        std.Add(stack);
        stack[0].should.equal(3);

        stack = [4,1];
        std.Sub(stack);
        stack[0].should.equal(3);

        stack = [2,5];
        std.Mul(stack);
        stack[0].should.equal(10);

        stack = [4,2];
        std.Div(stack);
        stack[0].should.equal(2);

        stack = [5,3];
        std.Rem(stack);
        stack[0].should.equal(2);

        stack = [4];
        std.Inc(stack);
        stack[0].should.equal(5);

        stack = [4];
        std.Dec(stack);
        stack[0].should.equal(3);

        stack = [3];
        std.Neg(stack);
        stack[0].should.equal(-3);
    });

    it('should perform valid bitwise arithmetic', function() {
        var stack = [2];
        std.Complement(stack);
        stack[0].should.equal(-3);

        stack = [2,2,4,2];
        std.Band(stack);
        stack[2].should.equal(0);
        std.Zap(stack);
        std.Band(stack);
        stack[0].should.equal(2);

        stack = [1,4];
        std.Bor(stack);
        stack[0].should.equal(5);

        stack = [3, 1];
        std.Xor(stack);
        stack[0].should.equal(2);

        stack = [2,1];
        std.Shl(stack);
        stack[0].should.equal(4);

        stack = [-4,1];
        std.Shr(stack);
        stack[0].should.equal(-2);

        stack = [-4,1];
        std.Shr_u(stack);
        stack[0].should.equal(2147483646);
    });

    it('should perform valid boolean logic', function() {
        var stack = [true,false,true,true];
        std.And(stack);
        stack[2].should.equal(true);
        std.Zap(stack);
        std.And(stack);
        stack[0].should.equal(false);

        var stack = [true,false,false,false];
        std.Or(stack);
        stack[2].should.equal(false);
        std.Zap(stack);
        std.Or(stack);
        stack[0].should.equal(true);

        var stack = [false];
        std.Not(stack);
        stack[0].should.equal(true);
    });

    it('should do object access correctly', function() {
        var stack = [2, {}, "hodor"];
        std.Setvalobj(stack);
        stack.should.have.length(1);
        stack[0].hodor.should.equal(2);

        stack = [{}, 2, "hodor"];
        std.Setobjval(stack);
        stack.should.have.length(1);
        stack[0].hodor.should.equal(2);

        stack = [{hodor: 2}, "hodor"];
        std.Getprop(stack);
        stack.should.have.length(2);
        stack[1].should.equal(2);
    });

    it('should answer type questions correctly', function() {
        var stack = [null];
        std.Null$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [true, 'boolean'];
        std.Typeof$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [[2]];
        std.Quotation$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = ['hodor'];
        std.String$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [2];
        std.Number$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [false];
        std.Boolean$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [{}];
        std.Object$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [[]];
        std.Object$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(false);
    });

    it('should perform object utilities correctly', function() {
        var stack = [{}];
        std.Freeze(stack);
        std.Frozen$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [{}];
        std.Seal(stack);
        std.Sealed$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        stack = [{}];
        std.Stagnate(stack);
        std.Stagnant$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);

        std.Zap(stack);
        std.Extensible$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(false);
    });

    it('should perform collection utilities correctly', function() {
        var stack = [[]];
        std.Empty$(stack);
        stack.should.have.length(2);
        stack[1].should.equal(true);
    });
});
