Types
================================

Wort has a very small number of basic types, and does not have a mechanism for specifying user defined types. However, a surprising amount of expressive functionality can be implemented easily with the seven basic types: *null*, *boolean*, *number*, *string*, *object*, *quotation*, and *word*. These types can be divided into two categories: *value types* and *reference types*.

Value typed elements, when ``dup``licated, are copied entirely as a separate element. Operations performed on the copy will change the copy independently of the original element. This is mostly useful for constants and smaller types, and so **booleans**, **numbers**, and **strings** are considered value types. This also means that value types can be considered to be *immutable*: the ``++`` word takes the top element of the stack (a number), discards it, and pushes the number that is one greater than the discarded value. This is intuitive for booleans and numbers, but strings are immutable in Wort as well. This means that strings are considered distinct from a quotation of characters, for instance, and are treated as such in the underlying representation.

Reference typed elements behave differently when ``dup``licated. Instead of copying the entire element, only a reference to the element is copied and placed on the stack. Thus, changes to the copied element will be reflected in the original element. Use ``clone`` if this is not the desired behavior, but be warned that cloning deeply nested objects and quotations can be an expensive operation. ``dup`` should suffice for most uses. ``clone`` behaves the same as ``dup`` on value types. The reference types available in Wort are **objects**, **quotations**, and **words**.

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
