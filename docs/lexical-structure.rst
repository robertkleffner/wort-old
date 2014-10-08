Lexical Structure
================================

The lexical structure of a programming language details what the individual words and symbols used in the language must look like. Things like strings, numbers, quotation literals, and word names are included under this specification, as well as the important tokens that *separate* them.

Character Set
--------------------------------

Wort files may be written using the Unicode character set. Implementations of the language must support Unicode 3 at the minimum, or any later version. This goes for string literals as well as identifiers in the language.

Wort is also case sensitive. For instance, the words ``dup``, ``Dup``, and ``DUP`` are all considered distinct. As such, primitive functions must be typed in a Wort file *exactly* as they appear in the reference manual. ``if`` is a keyword, but ``If`` is not.

Whitespace
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Whitespace is an essential part of any Wort file. All lexical tokens must be separated by at least one whitespace character in Wort. However, strict indentation and formatting as found in Python, for example, are not necessary for Wort, and you can utilize as much whitespace as you see fit. An exception to this occurs in string literals, which may not span multiple lines.

Wort recognizes several code points as whitespace. The most common one is ``\u{20}``, the regular space character, but also included are ``\u{9}``, the tab; ``\u{B}``, the vertical tab; ``\u{C}``, the form feed; ``\u{A0}``, the non-breaking space; ``\u{FEFF}``, the non-breaking space; and any code point in the Zs category. This is the same subset of characters recognized as spaces in JavaScript.

Wort treats the usual line break characters as whitespace, since they add nothing to the language syntax. For purposes of debugging in the Wort transpiler, however, the line feed character ``\u{A}`` is treated separately. Other common line break characters include ``\u{D}``, the carriage return; ``\u{2028}``, the line separator; and ``\u{2029}``, the paragraph separtor. The sequence ``\u{D}\u{A}``, more commonly seen as ``\r\n``, is also treated as a single line break. All of these characters or sequences are used by the Wort compiler to track the current line number for error reporting.

Normalization
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

All implementations of are required to normalized string literals with escaped code points. However, it is still possible to construct strings which are not normalized internally (using various character code functions). Wort does not care whether word names are normalized or not, but may normalized words as different that non-normalized ones depending on the implementation.

Comments
--------------------------------

Wort only supports single line comments, beginning with a ``#`` and running until the end of the line. All comments are ignored by the Wort transpiler.

Literals
--------------------------------

Literals are any collection or value that appear directly in the source code of a Wort program::

    null        # the null value
    13          # the number 13
    3.14        # the number 3.14
    'hodor'     # a string of text
    true        # a boolean literal
    [ 1 2 3 ]   # a quotation literal
    { a : 2 }   # an object literal with one field

Full details on the proper representations for these literals is given for each in their respective sections. However, a key point that will be introduced now, to motivate some thinking about the ideas behind Wort, is that all literals can be treated as a *function* which push the value they name onto the stack. Though a firm understanding of this point is not necessary for being able to use the language, it does help to illustrate the *homoiconicity* of Wort. For more of the theory behind concatenative programming, search for the Joy language on the web.

Word Literals
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

When a *word* appears directly in the source code of a Wort program, its default semantics are to execute the word, instead of pushing the internal representation of that word onto the stack. But sometimes it is useful to push the value of a word itself onto the stack. Such a case usually involves storing a word to be used later, since words are not runtime modifiable, unlike quotations. Say we wanted to store the addition operation on the stack. Then you would write::

    `+

Instead of regular old ``+``. Thus, the two statements below have different semantics::

    1 2 +       # pushes 1 and 2, then adds them
    1 2 `+      # pushes 1 and 2, then pushes the add op

In the first case, only one item remains on the stack, the number 3. In the second case, there are 3 items on the stack: 2 numbers and word type.

Identifiers
--------------------------------

Identifiers can be thought of as names. The use of such names is very restricted in Wort; identifiers may only name words, external modules, or the fields of objects. As mentioned in the introduction, there are no variables or classes in Wort.

A Wort identifier must begin with a letter (this may also be a Unicode letter), a dash ``-``, or a question mark ``?``. Wort identifiers can be any length, and any character after the first may be a letter, a digit, a dash, or a question mark. The following are legal identifiers:

    hodor
    why?
    -what-is-this-
    ????

Note that `-` and `--` are not legal identifiers, as they denote the subtraction operator and the decrement operator respectively. Also note that word names which begin with a dash are treated differently from those that don't: names which begin with a dash are considered *private* functions, whereas names which begin with any other valid character are considered *public*. This will be covered later in the modules section.

Operators and Primitives
--------------------------------

Wort specifies several primitive words. Due to the nature of Wort, which relies on a few basic principles, these primitives are treated no different from user defined words. The ``if`` word, for instance, is actually just a word instead of a separate syntax, and can be analyzed as any other word in Wort. However, Wort does not allow user defined functions to use a name that is used by a primitive, and hence these are called *reserved words*. The entire list of reserved words is as follows::

    zap
    swap
    cat
    clone
    cons
    dup
    uncons
    unit
    i
    x
    dip
    neg
    to-number
    to-boolean
    to-string
    typeof
    null?
    typeof?
    quotation?
    string?
    boolean?
    number?
    object?
    word?
    empty?
    in?
    has?
    where?
    similar?
    slice
    slice-from
    cut
    insert
    splice
    reverse
    sort
    fields
    values
    has-field?
    as-proto
    from-proto
    kill-field
    case
    branch
    when
    if
    cond
    while
    linrec
    tailrec
    genrec
    step
    fold
    map
    times
    filter
    split
    cleave
    spread
    apply
    annihilate
    gather
    substitute
    print
    printz
    print-stack

Wort also has a set of primitive operators, which are treated just like words but are often made up of symbols which can't be used in the names of regular words. The operation specified by most of these operators might be intuitive, but a full description of the operators and their semantics occurs later in the docs. For now, here is the entire list of operators included in Wort::

    +   -   *   /   %   ++  --      # arithmetic operators
    ~   &   |   ^   <<  >>  >>>     # bitwise operators
    &&  ||  !                       # logical operators
    ==  !=  <   <=  >   >=          # comparison operators
    ->  <-  @                       # property access operators

Object Access Syntax
--------------------------------

In Wort, every syntax token must separated from its neighbors by at least one whitespace character. However, there can be considered one exception to this rule: that of object property access. This special notation is designed to make it somewhat less verbose to modify an object on the stack. One can set a property on the object on top of the stack by typing either ``->prop-name`` or ``<-prop-name``. One can read the value of the specified property by typing ``@prop-name``. The specific operation of these rules is detailed later, but it is helpful to specify here that this notation is a valid part of the language. Any of the property access operators directly followed by a valid identifier will transform into the equivalent notation::

    ->prop-name         # becomes: 'prop-name' ->
    <-prop-name         # becomes: 'prop-name' <-
    @prop-name          # becomes: 'prop-name' @

In some targets, the compiler is able to better optimize the syntax given above, so it is sometimes preferable to use it for both readability *and* performance.

Stack Shuffle Notation
--------------------------------

Stack shuffle notation makes it simple to quickly rearrange items on the stack without using a long string of combinators. However, because stack shuffles often tend to obscure the flow of the program, it is recommended that they be used sparingly. A stack shuffle occurs between two parentheses, and gives a temporary name to a variable on the stack which allows it to be referenced within the stack shuffle. The operations that can be performed in a stack shuffle are limited to popping an element and pushing it, to keep stack shuffles easy to read. Each element name can be only one letter long, to keep stack shuffles short. All this may be a bit confusing, so here's an example::

    (ab-aabb)

Say we have a stack ``[ 1 2 ]``, with **2** the top element. The stack after running this shuffle will look like ``[ 1 1 2 2 ]``. This stack shuffle is equivalent to the combinator sequence ``[dup] dip dup``, but is much more intuitive: it duplicates the top two elements of the stack, such that the copies of the second element on the stack are below the copies of the top element. Another example might be::

    (xyz-z)

This shuffle just deletes the two elements below the top of the stack.

There are two sides to every stack shuffle, separated by a dash ``-``. The left side gives names to each stack element, with the letter furthest right naming the top element of the stack, while the second-most from the right names the second element from the top, and so on. At least one letter must be used on the left side, but no letter may be used more than twice, since the letter name would refer to two different elements on the stack.

The right hand side can be thought of as *executing* from left to right: in the shuffle ``(ab-aabb)``, first **a** is pushed, then **a** is pushed again, then **b** is pushed, then **b** is pushed again. A right hand side need not contain any letters at all, and can reference any letter multiple times. However, each letter in the right hand side must appear once (and only once) in the left hand side.

Only lower case letters may be used as variable names. This limits the number of stack variables you can create, but if you need more than 26 stack variables for a stack shuffle, you're probably doing something wrong.
