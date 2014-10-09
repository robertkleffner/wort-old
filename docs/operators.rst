Operator Semantics
================================

*Operators* are a special type of word in Wort, but only in a lexical manner. Wort operators are not really distinguishable from the other primitive words semantically: they still use the notion of function composition and are still written from left to right, assuming arguments have already been placed on the stack. Thus there are no *infix* operators in Wort, a departure from other common languages. Indeed, the only noticeable separating factor between operators and primitive built-ins is that operators are named using symbols which are often not allowed in the usual word naming scheme.

The sections below describe how the Wort operators act given an arbitrary stack of elements. It aims to be somewhat formal, but makes no claim to any sort of formal verification.

Arithmetic Operators
--------------------------------

Wort defines **seven** arithmetic operators.

Adddition: +
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**(Number Number - Number)**

The addition operator pops the top two elements from the stack. If they are numbers, it pushes their sum. The sum of a floating point number and an integer will always be a float. The sum of two integers will be an integer. The operation will generate a runtime error if either of the arguments is not a number.

Subtraction: -
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**(Number Number - Number)**

The subtraction operator pops the top two elements from the stack. If they are numbers, it pushes the difference of the second element and the top element (the second element minus the top element). The difference of a floating point number and an integer will always be a float. The difference of two integers will be an integer. The operation generate a runtime error if either of the arguments is not a number.

Multiplication: *
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**(Number Number - Number)**

The multiplication operator pops the top two elements from the stack. If they are numbers, it pushes the product of the two elements. The product of a floating point number and an integer will be a float. The product of two integers will be an integer. The operation will generate a runtime error if either of the arguments is not a number.

Division: /
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**(Number Number - Number)**

The division operator pops the top two elements from the stack. If they are numbers, it pushes the quotient of the second element and the top element (the second element divided by the top element). The quotient of any two numbers is always a floating point number. The operation will generate a runtime error if either of the arguments is not a number.

Remainder: %
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**(Number Number - Number)**

The remainder operator pops the top two elements from the stack. If they are numbers, it pushes the remainder of the second element divided by the top element. The effects of this are different depending on whether at least one of the numbers is a float, or if both are integers.
