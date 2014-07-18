test = {};

test.testSub = function(stack, index) {
    stack[++wort.ind] = "\n### testing subtraction ###";
    console.log(stack[wort.ind]);
    stack[++wort.ind] = 4;
    test.write(stack);
    stack[++wort.ind] = "-";
    test.writep(stack);
    stack[++wort.ind] = 5;
    test.write(stack);
    stack[++wort.ind] = "=";
    test.writep(stack);
    stack[--wort.ind] = stack[wort.ind] - stack[wort.ind+1];
    console.log(stack[wort.ind]);
};

test.testQuotation = function(stack, index) {
    stack[++wort.ind] = "\n### testing quotations ###";
    console.log(stack[wort.ind--]);
    stack[++wort.ind] = [
    1,
    2,
    3,
    4,
    wort.printp,
    "a string",
    wort.printp,
    ];
    console.log(stack[wort.ind--]);
};

test.writep = function(stack, index) {
    test.write(stack);
    wort.ind--;
};

test.testSwap = function(stack, index) {
    stack[++wort.ind] = "\n### testing swap ###";
    console.log(stack[wort.ind]);
    stack[++wort.ind] = 3;
    console.log(stack[wort.ind]);
    stack[++wort.ind] = 4;
    console.log(stack[wort.ind]);
    wort.swap(stack);
    console.log(stack[wort.ind--]);
    console.log(stack[wort.ind--]);
};

test.testNumbers = function(stack, index) {
    stack[++wort.ind] = "\n### testing numbers";
    console.log(stack[wort.ind--]);
    stack[++wort.ind] = 1;
    console.log(stack[wort.ind--]);
    stack[++wort.ind] = 2.56789;
    console.log(stack[wort.ind--]);
    stack[++wort.ind] = 100;
    console.log(stack[wort.ind--]);
};

test.testStrings = function(stack, index) {
    stack[++wort.ind] = "\n### testing strings ###";
    console.log(stack[wort.ind--]);
    stack[++wort.ind] = "hello, wort!";
    console.log(stack[wort.ind--]);
    stack[++wort.ind] = "escape\tsequences!\n";
    console.log(stack[wort.ind--]);
};

test.write = function(stack, index) {
     process.stdout.write(stack[wort.ind] + ''); 
};

test.testMul = function(stack, index) {
    stack[++wort.ind] = "\n### testing multiplication ###";
    console.log(stack[wort.ind]);
    stack[++wort.ind] = 4;
    test.write(stack);
    stack[++wort.ind] = "*";
    test.writep(stack);
    stack[++wort.ind] = 5;
    test.write(stack);
    stack[++wort.ind] = "=";
    test.writep(stack);
    stack[--wort.ind] = stack[wort.ind] * stack[wort.ind+1];
    console.log(stack[wort.ind]);
};

test.testAdd = function(stack, index) {
    stack[++wort.ind] = "\n### testing addition ###";
    console.log(stack[wort.ind]);
    stack[++wort.ind] = 4;
    test.write(stack);
    stack[++wort.ind] = "+";
    test.writep(stack);
    stack[++wort.ind] = 5;
    test.write(stack);
    stack[++wort.ind] = "=";
    test.writep(stack);
    stack[--wort.ind] = stack[wort.ind] + stack[wort.ind+1];
    console.log(stack[wort.ind]);
};

test.testInlineJs = function(stack, index) {
    
    console.log("\n### testing inline js ###");
    console.log("why hello there~ I'm some inline javascript");
    console.log(1+2);
    
};

test.testDup = function(stack, index) {
    stack[++wort.ind] = "\n### testing dup ###";
    console.log(stack[wort.ind--]);
    stack[++wort.ind] = 3;
    stack[++wort.ind] = stack[wort.ind-1];
    console.log(stack[wort.ind--]);
    console.log(stack[wort.ind--]);
};

test.testDiv = function(stack, index) {
    stack[++wort.ind] = "\n### testing division ###";
    console.log(stack[wort.ind]);
    stack[++wort.ind] = 4;
    test.write(stack);
    stack[++wort.ind] = "/";
    test.writep(stack);
    stack[++wort.ind] = 5;
    test.write(stack);
    stack[++wort.ind] = "=";
    test.writep(stack);
    stack[--wort.ind] = stack[wort.ind] / stack[wort.ind+1];
    console.log(stack[wort.ind]);
};

test.main = function(stack, index) {
    test.testNumbers(stack);
    test.testStrings(stack);
    test.testQuotation(stack);
    test.testPop(stack);
    test.testDup(stack);
    test.testSwap(stack);
    test.testCat(stack);
    test.testAdd(stack);
    test.testSub(stack);
    test.testMul(stack);
    test.testDiv(stack);
    test.testInlineJs(stack);
};

test.testPop = function(stack, index) {
    stack[++wort.ind] = "\n### testing zap ###";
    console.log(stack[wort.ind--]);
    stack[++wort.ind] = 1;
    stack[++wort.ind] = 2;
    console.log(stack[wort.ind--]);
    console.log(stack[wort.ind--]);
    stack[++wort.ind] = 3;
    console.log(stack[wort.ind--]);
};

test.testCat = function(stack, index) {
    stack[++wort.ind] = "\n### testing cat ###";
    console.log(stack[wort.ind]);
    stack[++wort.ind] = [
    1,
    2,
    ];
    console.log(stack[wort.ind]);
    stack[++wort.ind] = [
    3,
    4,
    ];
    console.log(stack[wort.ind]);
    stack[--wort.ind] = stack[wort.ind].concat(stack[wort.ind+1]);
    console.log(stack[wort.ind--]);
};

wort = { true: true, false: false };

wort.zap = function(stack) { wort.ind--; };
wort.dup = function(stack) { stack[++wort.ind] = stack[wort.ind-1]; };
wort.swap = function(stack) {
    var tmp = stack[wort.ind];
    stack[wort.ind] = stack[wort.ind-1];
    stack[wort.ind-1] = tmp;
};
wort.cat = function(stack) { stack[--wort.ind] = stack[wort.ind].concat(stack[wort.ind+1]); };
wort.cons = function(stack) { stack[wort.ind].unshift(stack[--wort.ind]);stack[wort.ind]=stack[wort.ind+1]; };
wort.add = function(stack) { stack[--wort.ind] = stack[wort.ind] + stack[wort.ind+1]; };
wort.sub = function(stack) { stack[--wort.ind] = stack[wort.ind] - stack[wort.ind+1]; };
wort.mul = function(stack) { stack[--wort.ind] = stack[wort.ind] * stack[wort.ind+1]; };
wort.div = function(stack) { stack[--wort.ind] = stack[wort.ind] / stack[wort.ind+1]; };
wort.print = function(stack) { console.log(stack[wort.ind]); };
wort.printp = function(stack) { console.log(stack[wort.ind--]); };
wort.ind = -1;
wort.run = function () {
    var stack = [];
    test.main(stack);
};

wort.run();