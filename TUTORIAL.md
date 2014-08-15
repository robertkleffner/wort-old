# The Wort Tutorial

So you've got the compiler installed and you're ready to start written post-fix code, eh? This basic tutorial should give you a good introduction to using Wort as a language to build scripts or even projects.

## The Extreme Basics

Wort is a stack based language. This means that every word and operator reads from and modifies a global stack, rather than operating on a list of arguments and returning one or more values. If you are not familiar with how stacks work, there are plenty of good introductions available across the internet. Briefly, stacks have two primary operations: *pushing* data, which puts some item on the top of the stack, and *popping* data, which removes the data from the top of the stack. Another common operation, *peeking*, examines the element on top of the stack without popping it. Wort operations generally reflect one of these three operations, but some perform numerous combinations of both.

### Numbers

Let's start with *pushing* an number. To put an number on top of the stack, simply write it:

`2 3 4 5`

The stack will now contain elements 2, 3, 4, and 5. 5 will be the top element, and 2 will be the top element. This is because Wort performs all operations from *left to right*. Thus, there is no operator precedence in Wort. This is both a blessing and a curse.

### Definitions

The above example will not compile. Let's fix that:

`main: 2 3 4 5 ;`

Now the compiler ought to succeed. Wort does not have top-level expressions, because all stock modifying words and literals must occur within a *definition*. Wort programs are really just lists of definitions, which defined *words*. Words can be called later on simply by writing them:

```
push_three: 3 ;

main: push_three ;
```

This Wort program contains two defined words: `push_three` and `main`. Notice that `push_three` is *called* from within `main`. Because words (which are similar to functions in other languages) do not have argument lists, they are not written with parenthese after them. So this program calls a defined word `push_three`, which simply puts the number 3 on the stack.

Notice the format of the definition. First is the *word* you wish to define, followed by a colon. Then you have a list of zero or more *terms*, which can be literals or other word calls. The definition is terminated by a semicolon.

Note also that all Wort programs that you wish to run must have a `main` function, written exactly that way. This is considered the *entry point* for execution of the program. All Wort programs begin execution with an empty stack.

### Output

If you run either of the valid programs above using Node, you won't see anything. We haven't actually called any output, so let's see how we can do that. Wort has three basic output mechanisms built in:

```
print1: 1 print ;
print2: 2 printz ;
print3: 3 print-stack ;
main: print1 print2 print3 ;
```

The first function will print out the number 1, as expected. The second function will print out the number two, and then pop it off the stack. Regular `print` does not pop the top element; `printz` does. The reason `printz` has a *z* at the end of its name is because the pop function is called `zap` in Wort (it just 'zaps' the top element and does nothing else). So `printz` is a portmanteaux of sorts from `print` and `zap`.

The third function will print `[1, 3]`. Wait, what? Remember, the first function *printed* 1 but did not pop it off the stack. So by the time we go to `print3`, 1 was still on the stack. `print3` then pushes a 3 onto the stack and then prints the entire stack, which still contains two elements. Keeping track of what is on the stack and when is a key part of programming in Wort.

In fact, we could defined our own version of `printz`:

```
printz: print zap ;
```

and it would work the same as the built-in version! However, if you try the above fragment, the compiler will complain because you're trying to overwrite a built-in word. If you want to define your own, can capitalize the first letter and things will run smoothly. Wort definitions are thus *case-sensitive*:

```
Printz: print zap ;
```

### Arithmetic

Wort has some built in operators for doing basic number operations as well.

```
add: 3 4 + printz ;
sub: 6 4 - printz ;
mul: 9 6 * printz ;
div: 8 2 / printz ;
rem: 8 5 % printz ;

main:
    add
    sub
    mul
    div
    rem ;
```

This program will print:

```
7
2
63
4
3
```

The operators `++` and `--` simply increment and decrement the number on top of the stack.

### Other literals

Wort supports a few other kinds of literals:

```
push_literals:
    3.14        # push a number
    "hi"        # push a string
    true        # push a boolean
    null        # push the null value (ew)
    { val: 2 }  # push an object with one property, 'val', which has the value 2
    [2 3 4]     # push a 'quotation' containing three values
;

main: push_literals print-stack ;
```

If you're familiar with JavaScript, most of these literals will make sense to you. The last literal, a quotation, is a lot like a list from other programming languages, or an Array in JavaScript. The difference is that quotations function as both lists and *anonymous functions* from lambda-based programming languages. We'll see more of this later.

## Stack Manipulation

Being able to move stuff around on the stack is essential to Wort programming, so the language provides a few useful functions and some extra syntax to move stuff around. Let's start simple with the `dup` word.

```
main: 2 dup print-stack;
```

This program puts the number 2 on the stack, then duplicates it, and then prints the stack, so it should print `[2, 2]`. That's pretty easy right? Dup just duplicates the element currently on top of the stack, but it's pretty essential for the basic functionality of any stack language. Let's examine another simple word:

```
main: [2 3 4 5] i print-stack;
```

`i` is a powerful word because it can take the quotation on top of the stack and *execute* it by running through each element and either pushing it (if it's a literal) or calling it (if it's a word). So this program will print `[2, 3, 4, 5]`. Note that, if it was the quotation we were printing, it would have printed `[[2, 3, 4, 5]]`. This means that each of 2, 3, 4, and 5 are now separate elements on the stack.

What if we want to access the item below the top element on the stack? For that we can use `swap`:

```
main: 3 4 swap - printz ;
```

This program will print `1` rather than `-1` because the two top elements of the stack changed their position (so that 3 was on top) before subtraction was performed. Subtraction always requires two numbers to be on top of the stack, and then subtracts the top number from the element below it. The division and remainder operators behave similarly.
