test = {};

test.testNeg = function(stack, index) {
    stack[++wort.ind] = "\n### testing negation ###";
    wort.printp(stack);
    stack[++wort.ind] = 3;
    wort.neg(stack);
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
    ];
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

test.testStrings = function(stack, index) {
    stack[++wort.ind] = "\n### testing strings ###";
    wort.printp(stack);
    stack[++wort.ind] = "hello, wort!";
    wort.printp(stack);
    stack[++wort.ind] = "escape\tsequences!\n";
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
    test.testInlineJs(stack);
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
    stack[++wort.ind] = 100;
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
wort.print = function(stack) { console.log(stack[wort.ind]); };
wort.printp = function(stack) { console.log(stack[wort.ind--]); };
wort.ind = -1;
wort.run = function () {
    var stack = [];
    test.main(stack);
};

wort.run();