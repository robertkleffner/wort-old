var should = require('chai').should(),
    std = require('../lib/std-node');

describe('#std', function() {
    it('should start with an index of -1', function() {
        std.ind.should.equal(-1);
    });

    it('should annihilate the stack', function() {
        var stack = [];
        std.exec([2, "hello"], stack);
        stack.should.have.length(2);
        std.ind.should.equal(1);

        std.annihilate(stack);
        stack.should.have.length(0);
        std.ind.should.equal(-1);
    });

    it('should execute a quotation', function() {
        var stack = [];
        std.annihilate(stack);
        std.exec([2, "hello", function(stack) { std.ind--; }], stack);
        std.ind.should.equal(0);
        stack.should.have.length(2);
        stack[0].should.equal(2);
        stack[1].should.equal("hello");
    });

    it('should push a null value on the stack', function() {
        var stack = [];
        std.annihilate(stack);

        std.null(stack);
        stack.should.have.length(1);
        should.not.exist(stack[0]);
    });

    it('should push boolean values on the stack', function() {
        var stack = [];
        std.annihilate(stack);

        std.true(stack);
        std.false(stack);
        stack.should.have.length(2);
        stack[0].should.equal(true);
        stack[1].should.equal(false);
    });

    it('should perform arithmetic', function() {
        var stack = [1,2];
        std.ind = 1;
        std.add(stack);
        stack[0].should.equal(3);
    });
});
