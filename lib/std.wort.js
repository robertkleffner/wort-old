module.exports = (function() {
var $0 = {};
function _exec(stack) {

    var q = arguments[0], stack = arguments[1];
    for (var i = 0; i < q.length; i++) {
        if (q[i] instanceof Function) {
            q[i](stack);
        } else {
            stack.push(q[i]);
        }
    }
    
}
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

    var item = stack[stack.length-1];
    if (Array.isArray(item)) {
        stack.push(item.concat());
    } else if (typeof item === 'object') {
        var obj = {};
        for (var i in item) {
            if (item.hasOwnProperty(i)) {
                obj[i] = item[i];
            }
        }
        stack.push(obj);
    } else {
        stack.push(item);
    }
    
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
        if (q[i] instanceof Function) {
            q[i](stack);
        } else {
            stack.push(q[i]);
        }
    }
    
};
$0.Dip = function(stack) {

    var q = stack.pop(), s = stack.pop();
    for (var i = 0; i < q.length; i++) {
        if (q[i] instanceof Function) {
            q[i](stack);
        } else {
            stack.push(q[i]);
        }
    }
    stack.push(s);
    
};
$0.Add = function(stack) {

    stack.push(stack.pop() + stack.pop());
    
};
$0.Sub = function(stack) {

    var top = stack.pop();
    stack.push(stack.pop() - top);
    
};
$0.Mul = function(stack) {

    stack.push(stack.pop() * stack.pop());
    
};
$0.Div = function(stack) {

    var top = stack.pop();
    stack.push(stack.pop() / top);
    
};
$0.Rem = function(stack) {

    var top = stack.pop();
    stack.push(stack.pop() % top);
    
};
$0.Inc = function(stack) {

    stack[stack.length-1]++;
    
};
$0.Dec = function(stack) {

    stack[stack.length-1]--;
    
};
$0.Neg = function(stack) {

    stack[stack.length-1] = -stack[stack.length-1];
    
};
$0.Complement = function(stack) {

    stack[stack.length-1] = ~stack[stack.length-1];
    
};
$0.Band = function(stack) {

    stack.push(stack.pop() & stack.pop());
    
};
$0.Bor = function(stack) {

    stack.push(stack.pop() | stack.pop());
    
};
$0.Xor = function(stack) {

    stack.push(stack.pop() ^ stack.pop());
    
};
$0.Shl = function(stack) {

    var top = stack.pop(); stack.push(stack.pop() << top);
    
};
$0.Shr = function(stack) {

    var top = stack.pop(); stack.push(stack.pop() >> top);
    
};
$0.Shr_u = function(stack) {

    var top = stack.pop(); stack.push(stack.pop() >>> top);
    
};
$0.And = function(stack) {

    var top = stack.pop();
    stack.push(stack.pop() && top);
    
};
$0.Or = function(stack) {

    var top = stack.pop();
    stack.push(stack.pop() || top);
    
};
$0.Not = function(stack) {

    stack[stack.length-1] = !stack[stack.length-1];
    
};
$0.Same = function(stack) {

    stack.push(stack.pop() == stack.pop());
    
};
$0.Notsame = function(stack) {

    stack.push(stack.pop() != stack.pop());
    
};
$0.Eq = function(stack) {

    stack.push(stack.pop() === stack.pop());
    
};
$0.Noteq = function(stack) {

    stack.push(stack.pop() !== stack.pop());
    
};
$0.Less = function(stack) {

    var top = stack.pop();
    stack.push(stack.pop() < top);
    
};
$0.Lesseq = function(stack) {

    var top = stack.pop();
    stack.push(stack.pop() <= top);
    
};
$0.Greater = function(stack) {

    var top = stack.pop();
    stack.push(stack.pop() > top);
    
};
$0.Greatereq = function(stack) {

    var top = stack.pop();
    stack.push(stack.pop() >= top);
    
};
$0.Setvalobj = function(stack) {

    var name = arguments[1] || stack.pop();
    var obj = stack.pop();
    obj[name] = stack.pop();
    stack.push(obj);
    
};
$0.Setobjval = function(stack) {

    var name = arguments[1] || stack.pop();
    stack[stack.length-2][name] = stack.pop();
    
};
$0.Getprop = function(stack) {

    var name = arguments[1] || stack.pop();
    stack.push(stack[stack.length-1][name]);
    
};
$0.Typeof = function(stack) {

    stack.push(typeof stack[stack.length-1]);
    
};
$0.Null$ = function(stack) {

    stack.push(stack[stack.length-1] === null);
    
};
$0.Typeof$ = function(stack) {

    stack.push((typeof stack[stack.length-2]) === stack.pop());
    
};
$0.Quotation$ = function(stack) {

    stack.push(Array.isArray(stack[stack.length-1]));
    
};
$0.String$ = function(stack) {

    stack.push(typeof stack[stack.length-1] === 'string');
    
};
$0.Number$ = function(stack) {

    stack.push(typeof stack[stack.length-1] === 'number');
    
};
$0.Boolean$ = function(stack) {

    stack.push(typeof stack[stack.length-1] === 'boolean');
    
};
$0.Object$ = function(stack) {

    stack.push((typeof stack[stack.length-1] === 'object') && !Array.isArray(stack[stack.length-1]));
    
};
$0.Freeze = function(stack) {

    Object.freeze(stack[stack.length-1]);
    
};
$0.Frozen$ = function(stack) {

    stack.push(Object.isFrozen(stack[stack.length-1]));
    
};
$0.Seal = function(stack) {

    Object.seal(stack[stack.length-1]);
    
};
$0.Sealed$ = function(stack) {

    stack.push(Object.isFrozen(stack[stack.length-1]));
    
};
$0.Stagnate = function(stack) {

    Object.preventExtensions(stack[stack.length-1]);
    
};
$0.Stagnant$ = function(stack) {

    stack.push(Object.isExtensible(stack[stack.length-1]) === false);
    
};
$0.Extensible$ = function(stack) {

    stack.push(Object.isExtensible(stack[stack.length-1]));
    
};
$0.Empty$ = function(stack) {

    stack.push(stack[stack.length-1].length === 0);
    
};
$0.In$ = function(stack) {

    stack.push(stack[stack.length-1].indexOf(stack[stack.length-2]) !== -1);
    
};
$0.Has$ = function(stack) {

    stack.push(stack[stack.length-2].indexOf(stack[stack.length-1]) !== -1);
    
};
$0.Where$ = function(stack) {

    stack.push(stack[stack.length-2].indexOf(stack[stack.length-1]));
    
};
$0.Slice = function(stack) {

    var end = stack.pop();
    var begin = stack.pop();
    stack.push(stack[stack.length-1].slice(begin, end));
    
};
$0.Slice_from = function(stack) {

    stack.push(stack[stack.length-2].slice(stack.pop()));
    
};
$0.Cut = function(stack) {

    var count = stack.pop();
    var ind = stack.pop();
    stack.push(stack[stack.length-1].splice(ind, count));
    
};
$0.Insert = function(stack) {

    var item = stack.pop();
    var ind = stack.pop();
    stack[stack.length-1].splice(ind, 0, item);
    
};
$0.Splice = function(stack) {

    var item = stack.pop();
    var ind = stack.pop();
    var dest = stack[stack.length-1];
    dest.splice.apply(dest, [ind, 0].concat(item));
    
};
$0.Reverse = function(stack) {

    stack[stack.length-1].reverse();
    
};
$0.Sort = function(stack) {

    stack[stack.length-1].sort();
    
};
$0.Case = function(stack) {

    var list = stack.pop();
    var ind = stack.pop();
    for (var i = 0; i < list.length; i++) {
        if (list[i][0] === ind) {
            _exec(list[i][1], stack);
            break;
        }
    }
    
};
$0.Branch = function(stack) {

    var qfalse = stack.pop();
    var qtrue = stack.pop();
    if (stack.pop()) {
        _exec(qtrue, stack);
    } else {
        _exec(qfalse, stack);
    }
    
};
$0.If = function(stack) {

    var qtrue = stack.pop();
    _exec(stack.pop(), stack);
    if (stack.pop()) {
        _exec(qtrue, stack);
    }
    
};
$0.If_else = function(stack) {

    var qfalse = stack.pop();
    var qtrue = stack.pop();
    _exec(stack.pop(), stack);
    if (stack.pop()) {
        _exec(qtrue, stack);
    } else {
        _exec(qfalse, stack);
    }
    
};
$0.Cond = function(stack) {

    var list = stack.pop();
    for (var i = 0; i < list.length - 1; i++) {
        _exec(list[i][0], stack);
        if (stack.pop()) {
            _exec(list[i][1], stack);
            return;
        }
    }
    _exec(list[list.length-1], stack);
    
};
$0.While = function(stack) {

    var iter = stack.pop();
    var cond = stack.pop();
    _exec(cond, stack);
    while (stack.pop()) {
        _exec(iter, stack);
        _exec(cond, stack);
    }
    
};
$0.Linrec = function(stack) {

    var p2 = stack.pop();
    var p1 = stack.pop();
    var fin = stack.pop();
    var cond = stack.pop();
    var count = 0;
    _exec(cond, stack);
    while (stack.pop() === false) {
        _exec(p1, stack);
        _exec(cond, stack);
        count++;
    }
    _exec(fin, stack);
    for (var i = 0; i < count; i++) {
        _exec(p2, stack);
    }
    
};
$0.Tailrec = function(stack) {

    var rec = stack.pop();
    var fin = stack.pop();
    var cond = stack.pop();
    _exec(cond, stack);
    while (stack.pop() === false) {
        _exec(rec, stack);
        _exec(cond, stack);
    }
    _exec(fin, stack);
    
};
$0.Genrec = function(stack) {

    var p2 = stack.pop();
    var p1 = stack.pop();
    var fin = stack.pop();
    var cond = stack.pop();
    _exec(cond, stack);
    if (stack.pop() === false) {
        _exec(p1, stack);
        stack.push([cond, fin, p1, p2, $0.Genrec]);
        _exec(p2, stack);
    } else {
        _exec(fin, stack);
    }
    
};
$0.Step = function(stack) {

    var iter = stack.pop();
    var list = stack.pop();
    for (var i = 0; i < list.length; i++) {
        stack.push(list[i]);
        _exec(iter, stack);
    }
    
};
$0.Fold = function(stack) {

    var iter = stack.pop();
    var init = stack.pop();
    var list = stack.pop();
    stack.push(init);
    for (var i = 0; i < list.length; i++) {
        stack.push(list[i]);
        _exec(iter, stack);
    }
    
};
$0.Map = function(stack) {

    var iter = stack.pop();
    var list = stack.pop();
    for (var i = 0; i < list.length; i++) {
        stack.push(list[i]);
        _exec(iter, stack);
        list[i] = stack.pop();
    }
    stack.push(list);
    
};
$0.Times = function(stack) {

    var iter = stack.pop();
    var num = stack.pop();
    for (var i = 0; i < num; i++) {
        _exec(iter, stack);
    }
    
};
$0.Filter = function(stack) {

    var cond = stack.pop();
    var list = stack.pop();
    var filtered = [];
    for (var i = 0; i < list.length; i++) {
        stack.push(list[i]);
        _exec(cond, stack);
        if (stack.pop()) {
            filtered.push(stack.pop());
        } else {
            stack.pop();
        }
    }
    stack.push(filtered);
    
};
$0.Split = function(stack) {

    var cond = stack.pop();
    var list = stack.pop();
    var qtrue = [], qfalse = [];
    for (var i = 0; i < list.length; i++) {
        stack.push(list[i]);
        _exec(cond, stack);
        if (stack.pop()) {
            qtrue.push(stack.pop());
        } else {
            qfalse.push(stack.pop());
        }
    }
    stack.push(qtrue);
    stack.push(qfalse);
    
};
$0.Annihilate = function(stack) {

    stack.length = 0;
    
};
$0.Gather = function(stack) {

    var amount = stack.pop();
    stack.push(stack.splice(-amount, amount));
    
};
$0.Spread = function(stack) {

    var top = stack.pop();
    stack = stack.push.apply(stack, top);
    
};
$0.Substitute = function(stack) {

    var sub = stack.pop();
    stack.length = 0;
    stack.push.apply(stack, sub);
    
};
$0.To_string = function(stack) {

    stack.push(stack[stack.length-1].toString());
    
};
$0.Print = function(stack) {

    console.log(stack[stack.length-1]);
    
};
$0.Printz = function(stack) {

    console.log(stack.pop());
    
};
return $0;
})();
