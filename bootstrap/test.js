test = {};

test.testNeg = function(stack, index) {
    stack[++wort.ind] = "\n### testing negation ###";
    wort.printp(stack);
    stack[++wort.ind] = 3;
    wort.neg(stack);
    wort.printp(stack);
};

test.testBitwiseXor = function(stack, index) {
    stack[++wort.ind] = "\n### testing bitwise XOR ###";
    wort.printp(stack);
    stack[++wort.ind] = 2;
    stack[++wort.ind] = 2;
    wort.xor(stack);
    wort.printp(stack);
};

test.testQuotation = function(stack, index) {
    stack[++wort.ind] = "\n### testing quotations ###";
    wort.printp(stack);
    stack[++wort.ind] = [
    1,
    2,
    3,
    4,
    wort.printp,
    "a string",
    wort.printp,
    [
    5,
    67,
    -8,
    ],
    ];
    wort.printp(stack);
};

test.testNotSame = function(stack, index) {
    stack[++wort.ind] = "\n### testing not same ###";
    wort.printp(stack);
    wort.true(stack);
    wort.false(stack);
    wort.notsame(stack);
    wort.printp(stack);
    stack[++wort.ind] = 3;
    stack[++wort.ind] = "3";
    wort.notsame(stack);
    wort.printp(stack);
};

test.testSwap = function(stack, index) {
    stack[++wort.ind] = "\n### testing swap ###";
    wort.printp(stack);
    stack[++wort.ind] = 3;
    wort.print(stack);
    stack[++wort.ind] = 4;
    wort.print(stack);
    wort.swap(stack);
    wort.printp(stack);
    wort.printp(stack);
};

test.testGreater = function(stack, index) {
    stack[++wort.ind] = "\n### testing greater ###";
    wort.printp(stack);
    stack[++wort.ind] = 2;
    stack[++wort.ind] = 1;
    wort.greater(stack);
    wort.printp(stack);
    stack[++wort.ind] = 3;
    stack[++wort.ind] = 4;
    wort.greater(stack);
    wort.printp(stack);
};

test.testNotEq = function(stack, index) {
    stack[++wort.ind] = "\n### testing not eq ###";
    wort.printp(stack);
    wort.true(stack);
    wort.false(stack);
    wort.noteq(stack);
    wort.printp(stack);
    stack[++wort.ind] = 3;
    stack[++wort.ind] = "3";
    wort.noteq(stack);
    wort.printp(stack);
};

test.testDiv = function(stack, index) {
    stack[++wort.ind] = "\n### testing division ###";
    wort.printp(stack);
    stack[++wort.ind] = 4;
    test.write(stack);
    stack[++wort.ind] = "/";
    test.writep(stack);
    stack[++wort.ind] = 5;
    test.write(stack);
    stack[++wort.ind] = "=";
    test.writep(stack);
    wort.div(stack);
    wort.print(stack);
};

test.testBooleans = function(stack, index) {
    stack[++wort.ind] = "\n### testing booleans";
    wort.printp(stack);
    wort.true(stack);
    wort.printp(stack);
    wort.false(stack);
    wort.printp(stack);
};

test.testDip = function(stack, index) {
    stack[++wort.ind] = "\n### testing dip ###";
    wort.printp(stack);
    stack[++wort.ind] = 5;
    stack[++wort.ind] = 4;
    stack[++wort.ind] = [
    wort.printp,
    ];
    wort.dip(stack);
    wort.printp(stack);
};

test.writep = function(stack, index) {
    test.write(stack);
    wort.zap(stack);
};

test.testRem = function(stack, index) {
    stack[++wort.ind] = "\n### testing rem ###";
    wort.printp(stack);
    stack[++wort.ind] = 4;
    test.write(stack);
    stack[++wort.ind] = "%";
    test.writep(stack);
    stack[++wort.ind] = 5;
    test.write(stack);
    stack[++wort.ind] = "=";
    test.writep(stack);
    wort.rem(stack);
    wort.print(stack);
};

test.write = function(stack, index) {
     process.stdout.write(stack[wort.ind] + ''); 
};

test.testShiftLeft = function(stack, index) {
    stack[++wort.ind] = "\n### testing shift left ###";
    wort.printp(stack);
    stack[++wort.ind] = 2;
    stack[++wort.ind] = 1;
    wort.shl(stack);
    wort.printp(stack);
};

test.testDec = function(stack, index) {
    stack[++wort.ind] = "\n### testing decrement ###";
    wort.printp(stack);
    stack[++wort.ind] = 2;
    wort.dec(stack);
    wort.printp(stack);
};

test.testInc = function(stack, index) {
    stack[++wort.ind] = "\n### testing increment ###";
    wort.printp(stack);
    stack[++wort.ind] = 1;
    wort.inc(stack);
    wort.printp(stack);
};

test.testInlineJs = function(stack, index) {
    
    console.log("\n### testing inline js ###");
    console.log("why hello there~ I'm some inline javascript");
    console.log(1+2);
    
};

test.testCat = function(stack, index) {
    stack[++wort.ind] = "\n### testing cat ###";
    wort.printp(stack);
    stack[++wort.ind] = [
    1,
    2,
    ];
    wort.print(stack);
    stack[++wort.ind] = [
    3,
    4,
    ];
    wort.print(stack);
    wort.cat(stack);
    wort.printp(stack);
};

test.testComplement = function(stack, index) {
    stack[++wort.ind] = "\n### testing complement ###";
    wort.printp(stack);
    stack[++wort.ind] = 4;
    wort.complement(stack);
    wort.printp(stack);
};

test.testLessEq = function(stack, index) {
    stack[++wort.ind] = "\n### testing lesseq ###";
    wort.printp(stack);
    stack[++wort.ind] = 1;
    stack[++wort.ind] = 2;
    wort.lesseq(stack);
    wort.printp(stack);
    stack[++wort.ind] = 4;
    stack[++wort.ind] = 4;
    wort.lesseq(stack);
    wort.printp(stack);
};

test.testOr = function(stack, index) {
    stack[++wort.ind] = "\n### testing boolean or ###";
    wort.printp(stack);
    wort.true(stack);
    wort.false(stack);
    wort.or(stack);
    wort.printp(stack);
    wort.false(stack);
    wort.false(stack);
    wort.or(stack);
    wort.printp(stack);
};

test.testLess = function(stack, index) {
    stack[++wort.ind] = "\n### testing less ###";
    wort.printp(stack);
    stack[++wort.ind] = 1;
    stack[++wort.ind] = 2;
    wort.less(stack);
    wort.printp(stack);
    stack[++wort.ind] = 4;
    stack[++wort.ind] = 3;
    wort.less(stack);
    wort.printp(stack);
};

test.testShiftRight = function(stack, index) {
    stack[++wort.ind] = "\n### testing shift right ###";
    wort.printp(stack);
    stack[++wort.ind] = 2;
    stack[++wort.ind] = 1;
    wort.shr(stack);
    wort.printp(stack);
    stack[++wort.ind] = -2;
    stack[++wort.ind] = 1;
    wort.shr(stack);
    wort.printp(stack);
};

test.testStrings = function(stack, index) {
    stack[++wort.ind] = "\n### testing strings ###";
    wort.printp(stack);
    stack[++wort.ind] = "hello, wort!";
    wort.printp(stack);
    stack[++wort.ind] = "escape\tsequences!\n";
    wort.printp(stack);
};

test.testShiftRightUnsigned = function(stack, index) {
    stack[++wort.ind] = "\n### testing shift right unsigned ###";
    wort.printp(stack);
    stack[++wort.ind] = 2;
    stack[++wort.ind] = 1;
    wort.shr_u(stack);
    wort.printp(stack);
    stack[++wort.ind] = -2;
    stack[++wort.ind] = 1;
    wort.shr_u(stack);
    wort.printp(stack);
};

test.testAdd = function(stack, index) {
    stack[++wort.ind] = "\n### testing addition ###";
    wort.printp(stack);
    stack[++wort.ind] = 4;
    test.write(stack);
    stack[++wort.ind] = "+";
    test.writep(stack);
    stack[++wort.ind] = 5;
    test.write(stack);
    stack[++wort.ind] = "=";
    test.writep(stack);
    wort.add(stack);
    wort.print(stack);
};

test.testTypeof = function(stack, index) {
    stack[++wort.ind] = "\n### testing typeof ###";
    wort.printp(stack);
    stack[++wort.ind] = 3;
    wort.typeof(stack);
    wort.printp(stack);
    stack[++wort.ind] = "hello";
    wort.typeof(stack);
    wort.printp(stack);
};

test.testUnit = function(stack, index) {
    stack[++wort.ind] = "\n### testing unit ###";
    wort.printp(stack);
    stack[++wort.ind] = 3;
    wort.unit(stack);
    wort.printp(stack);
};

test.testDup = function(stack, index) {
    stack[++wort.ind] = "\n### testing dup ###";
    wort.printp(stack);
    stack[++wort.ind] = 3;
    wort.dup(stack);
    wort.printp(stack);
    wort.printp(stack);
};

test.testGreaterEq = function(stack, index) {
    stack[++wort.ind] = "\n### testing greatereq ###";
    wort.printp(stack);
    stack[++wort.ind] = 2;
    stack[++wort.ind] = 1;
    wort.greatereq(stack);
    wort.printp(stack);
    stack[++wort.ind] = 4;
    stack[++wort.ind] = 4;
    wort.greatereq(stack);
    wort.printp(stack);
};

test.testSame = function(stack, index) {
    stack[++wort.ind] = "\n### testing same ###";
    wort.printp(stack);
    wort.true(stack);
    wort.false(stack);
    wort.same(stack);
    wort.printp(stack);
    stack[++wort.ind] = 3;
    stack[++wort.ind] = "3";
    wort.same(stack);
    wort.printp(stack);
};

test.main = function(stack, index) {
    test.testBooleans(stack);
    test.testNumbers(stack);
    test.testStrings(stack);
    test.testQuotation(stack);
    test.testPop(stack);
    test.testDup(stack);
    test.testSwap(stack);
    test.testCat(stack);
    test.testCons(stack);
    test.testUnit(stack);
    test.testI(stack);
    test.testDip(stack);
    test.testAdd(stack);
    test.testSub(stack);
    test.testMul(stack);
    test.testDiv(stack);
    test.testRem(stack);
    test.testInc(stack);
    test.testDec(stack);
    test.testNeg(stack);
    test.testComplement(stack);
    test.testBitwiseAnd(stack);
    test.testBitwiseOr(stack);
    test.testBitwiseXor(stack);
    test.testShiftLeft(stack);
    test.testShiftRight(stack);
    test.testShiftRightUnsigned(stack);
    test.testAnd(stack);
    test.testOr(stack);
    test.testSame(stack);
    test.testNotSame(stack);
    test.testEq(stack);
    test.testNotEq(stack);
    test.testLess(stack);
    test.testLessEq(stack);
    test.testGreater(stack);
    test.testGreaterEq(stack);
    test.testIsNull(stack);
    test.testTypeof(stack);
    test.testInlineJs(stack);
};

test.testEq = function(stack, index) {
    stack[++wort.ind] = "\n### testing eq ###";
    wort.printp(stack);
    stack[++wort.ind] = 3;
    stack[++wort.ind] = 3;
    wort.eq(stack);
    wort.printp(stack);
    stack[++wort.ind] = 3;
    stack[++wort.ind] = "3";
    wort.eq(stack);
    wort.printp(stack);
};

test.testSub = function(stack, index) {
    stack[++wort.ind] = "\n### testing subtraction ###";
    wort.printp(stack);
    stack[++wort.ind] = 4;
    test.write(stack);
    stack[++wort.ind] = "-";
    test.writep(stack);
    stack[++wort.ind] = 5;
    test.write(stack);
    stack[++wort.ind] = "=";
    test.writep(stack);
    wort.sub(stack);
    wort.print(stack);
};

test.testBitwiseAnd = function(stack, index) {
    stack[++wort.ind] = "\n### testing bitwise AND ###";
    wort.printp(stack);
    stack[++wort.ind] = 5;
    stack[++wort.ind] = 1;
    wort.band(stack);
    wort.printp(stack);
};

test.testCons = function(stack, index) {
    stack[++wort.ind] = "\n### testing cons ###";
    wort.printp(stack);
    stack[++wort.ind] = [
    1,
    2,
    ];
    stack[++wort.ind] = [
    3,
    ];
    wort.cons(stack);
    wort.printp(stack);
};

test.testNumbers = function(stack, index) {
    stack[++wort.ind] = "\n### testing numbers";
    wort.printp(stack);
    stack[++wort.ind] = 1;
    wort.printp(stack);
    stack[++wort.ind] = 2.56789;
    wort.printp(stack);
    stack[++wort.ind] = -100;
    wort.printp(stack);
};

test.testAnd = function(stack, index) {
    stack[++wort.ind] = "\n### testing boolean and ###";
    wort.printp(stack);
    wort.true(stack);
    wort.false(stack);
    wort.and(stack);
    wort.printp(stack);
    wort.true(stack);
    wort.true(stack);
    wort.and(stack);
    wort.printp(stack);
};

test.testMul = function(stack, index) {
    stack[++wort.ind] = "\n### testing multiplication ###";
    wort.printp(stack);
    stack[++wort.ind] = 4;
    test.write(stack);
    stack[++wort.ind] = "*";
    test.writep(stack);
    stack[++wort.ind] = 5;
    test.write(stack);
    stack[++wort.ind] = "=";
    test.writep(stack);
    wort.mul(stack);
    wort.print(stack);
};

test.testI = function(stack, index) {
    stack[++wort.ind] = "\n### testing i ###";
    wort.printp(stack);
    stack[++wort.ind] = [
    3,
    wort.printp,
    ];
    wort.print(stack);
    wort.i(stack);
};

test.testIsNull = function(stack, index) {
    stack[++wort.ind] = "\n### testing null? ###";
    wort.printp(stack);
    wort.null(stack);
    wort.print(stack);
    wort.null$(stack);
    wort.printp(stack);
};

test.testBitwiseOr = function(stack, index) {
    stack[++wort.ind] = "\n### testing bitwise OR ###";
    wort.printp(stack);
    stack[++wort.ind] = 4;
    stack[++wort.ind] = 2;
    wort.bor(stack);
    wort.printp(stack);
};

test.testPop = function(stack, index) {
    stack[++wort.ind] = "\n### testing zap ###";
    wort.printp(stack);
    stack[++wort.ind] = 1;
    stack[++wort.ind] = 2;
    wort.printp(stack);
    wort.printp(stack);
    stack[++wort.ind] = 3;
    wort.printp(stack);
};

wort = {};

wort.exec = function(quote, stack) {
    quote.forEach(function(elem) {
        if (elem instanceof Function) {
            elem(stack);
        } else {
            stack[++wort.ind] = elem;
        }
    });
};

wort.null = function(stack) { stack[++wort.ind] = null; };
wort.true = function(stack) { stack[++wort.ind] = true; };
wort.false = function(stack) { stack[++wort.ind] = false; };
wort.zap = function(stack) { wort.ind--; };
wort.dup = function(stack) { stack[++wort.ind] = stack[wort.ind-1]; };
wort.swap = function(stack) {
    var tmp = stack[wort.ind];
    stack[wort.ind] = stack[wort.ind-1];
    stack[wort.ind-1] = tmp;
};
wort.cat = function(stack) { stack[--wort.ind] = stack[wort.ind].concat(stack[wort.ind+1]); };
wort.cons = function(stack) { stack[wort.ind].unshift(stack[--wort.ind]);stack[wort.ind]=stack[wort.ind+1]; };
wort.unit = function(stack) { stack[wort.ind] = [stack[wort.ind]]; };
wort.i = function(stack) { wort.exec(stack[wort.ind--], stack); };
wort.dip = function(stack) {
    var top = stack[wort.ind--];
    var next = stack[wort.ind--];
    wort.exec(top, stack);
    stack[++wort.ind] = next;
};
wort.add = function(stack) { stack[--wort.ind] = stack[wort.ind] + stack[wort.ind+1]; };
wort.sub = function(stack) { stack[--wort.ind] = stack[wort.ind] - stack[wort.ind+1]; };
wort.mul = function(stack) { stack[--wort.ind] = stack[wort.ind] * stack[wort.ind+1]; };
wort.div = function(stack) { stack[--wort.ind] = stack[wort.ind] / stack[wort.ind+1]; };
wort.rem = function(stack) { stack[--wort.ind] = stack[wort.ind] % stack[wort.ind+1]; };
wort.inc = function(stack) { stack[wort.ind]++; };
wort.dec = function(stack) { stack[wort.ind]--; };
wort.neg = function(stack) { stack[wort.ind] = -stack[wort.ind]; };
wort.complement = function(stack) { stack[wort.ind] = ~stack[wort.ind]; };
wort.band = function(stack) { stack[--wort.ind] = stack[wort.ind] & stack[wort.ind+1]; };
wort.bor = function(stack) { stack[--wort.ind] = stack[wort.ind] | stack[wort.ind+1]; };
wort.xor = function(stack) { stack[--wort.ind] = stack[wort.ind] ^ stack[wort.ind+1]; };
wort.shl = function(stack) { stack[--wort.ind] = stack[wort.ind] << stack[wort.ind+1]; };
wort.shr = function(stack) { stack[--wort.ind] = stack[wort.ind] >> stack[wort.ind+1]; };
wort.shr_u = function(stack) { stack[--wort.ind] = stack[wort.ind] >>> stack[wort.ind+1]; };
wort.and = function(stack) { stack[--wort.ind] = stack[wort.ind] && stack[wort.ind+1]; };
wort.or = function(stack) { stack[--wort.ind] = stack[wort.ind] || stack[wort.ind+1]; };
wort.not = function(stack) { stack[wort.ind] = !stack[wort.ind]; };
wort.same = function(stack) { stack[++wort.ind] = stack[wort.ind-2] == stack[wort.ind-1]; };
wort.notsame = function(stack) { stack[++wort.ind] = stack[wort.ind-2] != stack[wort.ind-1]; };
wort.eq = function(stack) { stack[++wort.ind] = stack[wort.ind-2] === stack[wort.ind-1]; };
wort.noteq = function(stack) { stack[++wort.ind] = stack[wort.ind-2] !== stack[wort.ind-1]; };
wort.less = function(stack) { stack[++wort.ind] = stack[wort.ind-2] < stack[wort.ind-1]; };
wort.lesseq = function(stack) { stack[++wort.ind] = stack[wort.ind-2] <= stack[wort.ind-1]; };
wort.greater = function(stack) { stack[++wort.ind] = stack[wort.ind-2] > stack[wort.ind-1]; };
wort.greatereq = function(stack) { stack[++wort.ind] = stack[wort.ind-2] >= stack[wort.ind-1]; };
wort.null$ = function(stack) { stack[++wort.ind] = stack[wort.ind-1] == null; };
wort.typeof = function(stack) { stack[++wort.ind] = typeof stack[wort.ind-1]; };
wort.print = function(stack) { console.log(stack[wort.ind]); };
wort.printp = function(stack) { console.log(stack[wort.ind--]); };
wort.ind = -1;
wort.run = function () {
    var stack = [];
    test.main(stack);
};

wort.run();