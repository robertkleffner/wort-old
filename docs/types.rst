Types
================================

Wort has a very small number of basic types, and does not have a mechanism for specifying user defined types. However, a surprising amount of expressive functionality can be implemented easily with the seven basic types: *null*, *boolean*, *number*, *string*, *object*, *quotation*, and *word*. These types can be divided into two categories: *value types* and *reference types*.

Value typed elements, when ``dup`` -licated, are copied entirely as a separate element. Operations performed on the copy will change the copy independently of the original element. This is mostly useful for constants and smaller types, and so **booleans**, **numbers**, and **strings** are considered value types. This also means that value types can be considered to be *immutable*: the ``++`` word takes the top element of the stack (a number), discards it, and pushes the number that is one greater than the discarded value. This is intuitive for booleans and numbers, but strings are immutable in Wort as well. This means that strings are considered distinct from a quotation of characters, for instance, and are treated as such in the underlying representation.

Reference typed elements behave differently when ``dup`` -licated. Instead of copying the entire element, only a reference to the element is copied and placed on the stack. Thus, changes to the copied element will be reflected in the original element. Use ``clone`` if this is not the desired behavior, but be warned that cloning deeply nested objects and quotations can be an expensive operation. ``dup`` should suffice for most uses. ``clone`` behaves the same as ``dup`` on value types. The reference types available in Wort are **objects**, **quotations**, and **words**.

Null
--------------------------------

Null is considered neither a value type nor a reference type, since no operation may change its value. Null may only be pushed to the stack, consumed by some word or operation, or popped from the stack.

Booleans
--------------------------------

The boolean type can represent only two possible values, called ``true`` and ``false`` in Wort. These two words will push their respective values onto the stack. Comparison words will also usually generate a boolean, such as ``2 4 ==``, and booleans are often consumed by the branching functions, such as ``["hello" printz] ["goodbye" printz] branch``.

Any type in Wort can be converted to a boolean using the ``to-boolean`` primitive. Object, quotations, and words are always converted to **true**. The null value always converts to **false**. Strings and numbers always convert to **true**, with four exceptions that convert to **false**::

    0
    -0
    NaN     # floating point Not a Number value
    ""      # the empty string

The ``==`` comparison, and most other comparison operators, will return false when a boolean value is compared with an element of a different type. This is because the comparison operators in Wort first check to see if objects are of the same type before comparing them. However, if one wishes to compare ``false`` with ``0`` and get **true** as the result, the ``similar?`` word will perform some basic type conversions before comparing two elements together.

There are more operators that act on booleans, but these will be covered later in the primitives section.

Numbers
--------------------------------

Similar to JavaScript, Wort does not distinguish between integers and floating point numbers. While numbers are usually represented using a floating point representation (left up to the implementation to decide, but likely one of the IEEE standards), certain operations only make sense on integers (such as bitshifting or indexing in quotations). The underlying implementation will usually convert any floating point numbers to integers where possible before using them in such operations. More details for each such operations are available in the primitives section.

Integer Literals
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Wort supports the usual base-10 integer representation in source code, as a sequence of one or more digits ``0`` through ``9``, optionally preceded by a dash ``-`` to indicate a negative number. In addition to base-10, Wort also supports base-16 integer literals, which are represented using the digits for integers as well as the letters ``A`` through ``F``. Every hexadecimal literal must be preceded by the prefix ``0x`` to distinguish it from a regular integer or identifier. Here are some examples of integer literals::

    1
    13
    90909090909
    0xDEADBEEF

Floating Point Literals
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Floating point literals have a decimal part, which is usually two sequences of digits separated by a decimal point ``.``. If a decimal point is present, however, there must be at least one digit on both sides of the point. So the literal ``1.`` is not a valid floating point literal, and instead must be written ``1.0``.

Floating point literals may also be written with an optional exponent portion, which is the letter ``e`` followed by an optional minus sign, followed by an integer exponent. This notation represents the normal floating point portion multiplied by 10 raised to the integer exponent. In all, floating point literals can look like the following::

    3.14159
    0.9999999
    400.0
    123.456e8
    9876.543e-50

Strings
--------------------------------

Strings are an ordered sequence of Unicode code points. The underlying representation of a string is left to the implementation, and really doesn't matter so long as the operations on strings all have the specified behavior. This will be covered in the primitives section.

Wort's strings are immutable: primitives which look like they act on a string actually return a new string. This is mostly important for consideration when writing high efficiency algorithms, but does not much affect thinking about strings normally. It is also noteworthy that Wort has no type for an individual character: accessing an individual Unicode code point from a string is a special operation and returns a number. Indexing on strings can usually be thought of as slicing and returning a substring of length one. Strings are also distinct from quotations: a quotation containing only strings is not itself a string. This last fact should be mostly intuitive.

String Literals
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

String literals are written with single quotes around them like so: ``'hello'``. Double quotes do not need to be escaped inside the text of strings, but single quotes do. Each string literal must be written on a single line; there are no multi-line strings in Wort.

Like most languages supporting strings, Wort also supports various escape sequences that allow one to place special characters inside a string. Following in the time-honored tradition, Wort uses the ``\`` character to start an escape sequence. The following single character escape sequences are permitted by Wort::

    \0      # null character \u{0}
    \t      # horizontal tab
    \n      # line feed
    \r      # carriage return
    \v      # vertical tab
    \f      # form feed
    \'      # single quote
    \\      # back slash

Wort also supports a note of the form ``\u{xxxx}``, where ``x`` is any hexadecimal digit. These allow the construction of unicode characters of up to four bytes in length. Note that four digits are not required by the syntax, so ``\u{0}`` is as valid as ``\u{0000}``, and both represent the same character.

Objects
--------------------------------

Objects can be considered collections of key-value pairs. Objects also have a special hidden prototype property which can only be modified by a very few primitive words. Property access will walk the prototype chain, looking for a property in an object until either the property name and its corresponding value are found, or the end of the prototype chain is reached, in which case the null value is returned.

Properties may be added to objects after they have been created, as well as deleted from them. However, be warned that deleting a property from an object *is not* equivalent with assigning its value to null! If a property is deleted from an object, the access operators will search the prototype chain for the property as described above. However, if the property is instead defined to be null, the access operators will still recognize the name as being in the object! As such, deleting a property from an object requires the special primitive word ``kill-field``.

Also important to note is that the property assignment operators ``->`` and ``<-`` will *not* walk the prototype chain; if the property to be set is not found in the object, it will be created and given the specified value.

Objects are written between a pair of curly brackets ``{ }``, a syntax similar to JavaScript. This is called *object literal* notation. To specify a property and its value, enter a valid identifier, a colon ``:``, and then any valid Wort expression. Properties are separated by commas ``,`` to accomodate multiple word property values. Multi-term expressions are allowed as the value to be assigned, but will be reduced when the object is created. However, because expression in Wort may reduce to multiple values, the assigned value will always be a collection if the term is an expression which reduces to multiple values. If an expression reduces to a single value, then that value will be the property's values.

Objects literals may be nested within each other. Properties assigned to a single literal inside object literal notation will have the literal only as their value, instead of a collection containing that value.

To create a prototype relationship among two objects, use either the ``as-proto`` or ``from-proto`` words. The former takes the top item on the stack and makes it the prototype of the second item, whereas the latter takes the second item on the stack and makes it prototype of the top item. Only objects may be the prototypes of other objects. Both words return the child object as their single value. It is important to note that this child object will technically be a *copy* of the child object that was originally on the stack. This keeps the prototype chain from becoming circular a-la ``{ ... } dup as-proto``.

Quotations
--------------------------------

Quotations are one of the fundamental types in many concatenative languages, since like Lisp's lists, they can function as both code (in the form of anonymous functions) or as a data structure (a dynamically resizable list). Like arrays in many other languages, quotations are written using square brackets ``[...]``. Between these two brackets can be any valid Wort expression. However, the expression will not be evaluated when the quotation is first created. If a quotation ``[1 2 +]`` is pushed to the stack, that quotation will have a ``length`` of **3**. To force the evaluation of a quotation and push the results to the stack, use the ``i`` word or many various others which treat quotations as anonymous words.

It is crucial to learn how to see quotation as both data and dynamic code to acquire a feel for the language. This is one of the more exciting aspects of Wort and languages with support for homoiconicity in general.

Words
--------------------------------

Words are a separate type from quotations because they often function like substitution variables. Though I have repeated again and again that Wort does not have variables, one can, in a sense, think of words as variables which may only be assigned once and are in fact assigned at the beginning of execution. Say you have defined the word **double** to be::

    double : dup + ;

This word duplicates the element on top of the stack (expecting a number), the adds the duplicate to the original, replacing both the result of the addition. And say you use this word in your **main** function like so::

    main : 3 double ;

This has the exact same effect as, and is fully equivalent to::

    main : 3 dup + ;

So words can be thought of as substitutions. However, this is not an entirely accurate representation. Words can be pushed to the stack themselves by prefixing them as with a backslash ``\``. For instance, ``\+`` pushes the addition word itself onto the stack. Thus it is distinct from ``[+]``, which pushes *a quotation* containing the addition word onto the stack. However, in certain ways these notations are equivalent; for instance, ``1 2 \+ i`` has the same result as ``1 2 [+] i``. Indeed, most of the functions which act on quotations as anonymous functions can take a pushed word as an argument instead. However, words which treat a quotation like data, such as ``length`` and ``splice``, will not work on pushed words. This is because words may not be modified or redefined at run-time. So perhaps a better substitution rule for the word **double** in the fragment below::

    main : 3 double ;

might instead be::

    main : 3 [ dup + ] i ;   # equivalent to 'main : 3 dup + ;'

This is not necessarily how Wort performs this operation under the hood. Usually it is much more performant than the above fragment would be.
