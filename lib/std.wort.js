var std = (function() {
var $0 = {};
$0.Null = function(stack) {

    stack.push(null);
    
};
$0.True = function(stack) {

    stack.push(true);
    
};
$0.False = function(stack) {

    stack.push(false);
    
};
$0.Zap = function(stack) {

    stack.pop();
    
};
$0.Dup = function(stack) {

    stack.push(stack[stack.length-1]);
    
};
$0.Swap = function(stack) {

    var tmp = stack[stack.length-1];
    stack[stack.length-1] = stack[stack.length-2];
    stack[stack.length-2] = tmp;
    
};
$0.Cat = function(stack) {

    var top = stack.pop();
    stack.push(stack.pop().concat(top));
    
};
$0.Cons = function(stack) {

    var q = stack.pop();
    q.unshift(stack.pop());
    stack.push(q);
    
};
$0.Unit = function(stack) {

    stack[stack.length-1] = [stack[stack.length-1]];
    
};
$0.I = function(stack) {

    var q = stack.pop();
    for (var i = 0; i < q.length; i++) {
        if (quote[i] instanceof Function) {
            quote[i](stack);
        } else {
            stack.push(quote[i]);
        }
    }
    
};
$0.Dip = function(stack) {

    var q = stack.pop(), s = stack.pop();
    stack.push(q);
    this.I(stack);
    stack.push(s);
    
};
return $0;
})();
module.exports = std;
