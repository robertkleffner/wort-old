# Wort 0.1.4 Reference Manual

by Rob Kleffner

## Introduction

Wort is a dynamically typed scripting language following in the tradition of languages like Joy and [Factor](http://factorcode.org/). Though it aims to be primarily functional and list-processing oriented language, it also provides some object oriented operations based on JavaScript's prototypal objects. Wort is implemented as a transpile-to-JavaScript language, that is, one uses a small program to transform a Wort module into a JavaScript module which can then be run using NodeJS. Wort can also be compiled for the browser using any program which converts NodeJS modules to web compliant JavaScript, such as [browserify](http://browserify.org/). This means Wort can be used for both web and desktop programming, is by nature cross-platform, and can be used to develop applications for any target where JavaScript can be run.

Wort and its compiler are free software and are provided sans any guarantees under the MIT License.

As this is a reference manual, the discussion will not refrain from jargon typical of programming languages, particular that of concatenative and functional programming languages. A gentler introduction is currently on its way.

## Philosophy

There are three guiding principles behind the design of Wort:

- **Clarity**: Wort is meant to be easy to read and easy to comprehend. Extra syntax is kept to a minimum. Whitespace is appreciated.
- **Basic**: Wort has a small set of types and foundational semantics. It should be both easy to learn and easy to extend.
- **Playful**: There's more than one way to do it. And if none of those ways satisfy, you can make your own rules!

Secondary concerns at the moment include efficiency of execution and practicality. These are important concerns, but will be addressed after the first three concerns and will not preclude any design decisions made due to the first three principles. As such, it may not be a language suitable for high performance applications. But then, you're probably not using a scripting language anyway if that's your domain.

## The Language

This section describes the lexis, syntax, and semantics of the Wort language.

### Lexis

*Words* (also called *identifiers* or *names*) are the most crucial aspect of the Wort language. All names in Wort must begin with a letter. Letters are not, however, limited to the Roman alphabet. A large range of Unicode characters can be considered letters. The definition is not, however, as freely interpreted as in JavaScript. Any other characters in the name may be letters, digits (again, Unicode supported), dashes `-`, or questions marks `?`. Words are case sensitive.

However, the following built in words, which are a part of the standard library, cannot be used as definition names:

- null
- true, false
- zap, dup, swap, cat, cons, unit, i, dip
- neg
- typeof, null?, typeof?, quotation?, string?, number?, boolean?, object?
- freeze, frozen?, seal, sealed?, stagnate, stagnant?, extensible?
- empty?, in?, has?, where?, slice, slice-from, cut, insert, splice, reverse, sort
- case, branch, if, if-else, cond
- while, linrec, tailrec, genrec, step, fold, map, times, filter, split
- annihilate, gather, spread, substitute
- toString, print, printz

So, while the word `null` may not be used as a definition name, `Null` and `NULL` are perfectly valid and treated as separate names.

There is also a list of defined operators. The semantics of these operators may not be redefined by the user.

- + - \* \\ %
- ~ & | ^ << >> >>>
- && || !
- = != == !== < <= > >=
- <- -> @

*Object literals* follow the JavaScript format as well: `{ field_name: "field_value" }`. Hence, object literals can be nested in Wort.

*Quotation literals* use an array-like syntax. Elements are written between two square brackets with whitespace separating them. An example of a quotation containing three numbers: `[1 2 3]`. Quotations may be nested.

*Stack shuffle* sequences occur between parentheses. A stack shuffle is composed of two groups of lowercase alphabetical characters separated by a single dash, e.g. `(abc-bac)`. Every letter which occurs on the right hand side of the dash must be present in the left hand side, and each character in the left hand side must occur only once in the left hand side. Each character on the left side may occur zero, one, or multiple times on the right hand side. The left hand side must have at least one alphabetical character, but the right hand side is permitted to be empty.

*String literals* follow the JavaScript format, except they may be enclosed only in double quotes `""`. The backslash `\` precedes the usual escape sequences.

*Numeric literals* can be written with an optional sign and an optional decimal part.

*Comments* begin with a `#`. This makes it easy to insert hashtags into your code for all your social coding needs. /s

*Inline JavaScript*, one of the key aspects of Wort's extensibility, is any text between sequences of three tildes `~`. For instance,

```javascript
~~~ console.log("hello, world!"); ~~~
```

can be a valid part of a Wort definition. More on inline JavaScript in a later section.

#### Variables

Wort does not have a concept of variables. This will be explained later when the execution model of Wort is described, but this is such a significant difference from the majority of popular programming languages that it is worth mentioning as its own separate subsection.

#### Object Properties

Wort has a special syntax for accessing the properties of JavaScript objects. If an object is on top of the stack, then the term `@propertyName` will push the value of that object's .propertyName field onto the top of the stack. The value may then be operated on and modified. If the value is a quotation or another object, changes to it will be reflected automatically. Other types must be manually reassigned to the object property to change it.

There are two property setter syntaxes in Wort, `->propertyName` and `<-propertyName`. The first takes a value below the object on the stack and sets (top element).propertyName to be equal to it. The second syntax is its converse; that is, it takes the value on top of the stack and sets (second element).propertyName to be equal to it. So, if we wanted to set a rectangle object's height and width, we might do `{x: 0, y: 0, width: 0, height: 0} 100 <-width 50 <- height`. The first syntax `->` is useful for making object constructor definitions, while the latter syntax `<-` is most commonly used when modifying existing objects.

All three special symbols are available as operators that take an extra string argument on top of the stack, which functions as the property name. This is done via JavaScript's square-bracket object property notation.

### Types

Wort has a small number of basic types which are closely related to the underlying JavaScript types. This helps to make the transition between the two languages less abrupt. Wort's basic types are the *boolean*, *number*, *string*, *quotation*, *function*, and *object*. Booleans function like they do in JavaScript, and the same can be said for numbers (both integers and floating point numbers) and strings. Objects are just JavaScript objects, and functions are JavaScript functions.

Quotations are the real meat of the Wort language, functioning as both anonymous functions and list-like objects. Their underlying implementation is the JavaScript array, but the functionality provided by Wort allows one to treat them like run-time modifiable functions as well. In this respect Wort is similar to Lisp and other homoiconic languages, which make little distinction between data and code.

### Modules

A Wort module is a file, but Wort code files are really just a list of statements, which are explained below. Modules can contain both private and public definitions: private definitions are not visible to the outside and may only be used in their defining module, while public definitions may be utilized in other modules.

Modules may be 'required' by other modules, which allows the requiring module to use the public definitions of the required module. While non-Wort JavaScript modules may be required, they rarely interact easily with the Wort execution model. However, the properties of all required modules are accessible in inline JavaScript segments as well.

Modules may define a `main` method, spelled like so, which will function as an execution point of entry when the module is run with Node. If a module does not have a public `main` method, running it with node will do nothing.

### Statements

There are only two types of statement in Wort: require statements and definition. Wort, unlike many other concatenative languages, does not have top level expressions which are executed independently of definitions.

#### Require Statements

A require statement follows the format `require "module_name" as module-alias ;`. Require statements must occur at the beginning of a module, but neither `require` nor `as` are considered keywords. The require statement must always contain the module path and the module alias, and must always be terminated by a semicolon.

The module path just a file path to the transpiled JavaScript module you want to include, or a non-transpiled JavaScript module you wish to use in inline JavaScript. In short, it is the same path you would use if you were requiring a module in NodeJS. The module alias is a valid identifier. No two require statements are allowed to use the same alias identifier.

#### Definitions

Definitions in word are translated to JavaScript functions, and thus may be considered JavaScript functions under the hood. However, definitions are different in that they only ever take one argument (the runtime data stack) and always return one argument (the modified stack). This makes functions in Wort perfectly *composable*; however, as Wort is a dynamically type language, the transpiler will not catch any stack argument mismatches between called functions and this will result in a run-time error. More information will be given when the execution model is described.

The format of a definition looks visually like this: `name : term* ;`. All definitions must have a name and a list of zero or more terms. The name must be separated from the list of terms by a colon, and the list of terms must be terminated by a semicolon. A term may be any valid literal, a built in word, or a user defined word from the local module or some external module. External words, when used in a definition or inside a quotation, must be prefixed with the module alias used to require the module. All terms should generally be separated by white space.

Definitions may be either *public* or *private*; a *private* definition is any definition with a name prefixed by a dash, e.g. `-private`. Conversely, a *public* definition is any definition with a name **not** prefixed by a dash, e.g. `public`. Private definitions are not accessable outside of the module they are defined in. Public definitions are exported so they may be accessed outside of their defining module.

### Execution Model

Every term in Wort can be considered a function which takes exactly one argument (a stack with arbitrary elements) and returns exactly one value (a stack with arbitrary elements). Wort terms are thus considered *composable*, and thus writing `2` does not represent the number 2, but rather a function which takes a stack and pushes the number 2 onto that stack, returning the modified stack. Likewise, string literals, boolean literals, object literals, and quotation literals are all special functions which push their exact literal onto the stack. The flow of data is highly explicit in Wort: only the top element of the stack is accessible at any one time, and built in functions are used to manipulate the stack to shuffle, push, modify, and remove elements.

Wort has no variables because this would confuse and clutter the explicit flow of data through out the language. Unfortunately this has a tendency to make certain tasks, mathematical formulas especially, rather unintuitive looking as they must be written in Reverse Polish notation. This style also makes long definitions cumbersome and hard to read, so lots of small, easy to comprehend definitions are encouraged instead of large sprawling God-functions.

One extra bit of syntax which can sometimes alleviate numerous stack manipulation words is the *stack shuffle sequence* examined above. These short sequences of characters allow relocation and deletion of up to 26 elements from the top of the stack. However, it is highly recommended to keep the use of this mechanism as sparing as possible, and to keep the number of elements shuffled as small as possible when its use is convenient.

Because all Wort definitions are composable, there is no need to specify the order of evaluation nor list arguments. Calling a definition does not require any additional syntax then, i.e. there are no parentheses for a definition call, nor are there argument lists. If one wants to duplicate the top element on the stack, one writes `dup` instead of `dup()`. But it might help the transition to the composable style if one thinks of all functions as being called like so `func3(func2(func1(...)))`.

The `main` function always starts execution with an empty stack.

## Built-In Functions

Wort defines the following list of built-in functions in its Standard Library:

- null,
- true, false
- zap, dup, swap, cat, cons, unit, i, dip
- neg
- typeof, null?, typeof?, quotation?, string?, number?, boolean?, object?
- freeze, frozen?, seal, sealed?, stagnate, stagnant?
- empty?, in?, has?, where?, slice, slice-from, cut, insert, splice, reverse, sort
- case, branch, if, if-else, cond
- while, linrec, tailrec, genrec, step, fold, map, times, filter, split
- annihilate, gather, spread, substitute
- to-string, print, printz
