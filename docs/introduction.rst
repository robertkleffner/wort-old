Introduction
================================

Wort is a scripting language that aims to satisfy three adjectives: *playful*, *primitive*, and *clear*. These goals have inspired the design of Wort from the beginning. As such it is not a language that should be used for every occasion, but it should be a language used for fun occasions. Wort, in short, doesn't take things too seriously.

Don't let this cautious introduction sell you short though. Like many playful languages, Wort sports some powerful features:

*   A clean easy to read syntax
*   Higher-order functions
*   Prototypal objects
*   Anonymous functions which can be modified at runtime
*   Recursive combinators

But don't let that list get you too hyped. Wort is a very different kind of language, and it lacks:

*   Variables
*   Classes
*   Named arguments
*   Infix operators

Wort falls into the family of programming languages commonly called *concatenative*, which are often stack-based languages similar in spirit to Forth. As such, there are no local variables or named function arguments provided by the language. Every defined *word* (the Wort name for a function) operates on a single global stack. Words can push values onto this stack, modify values on the stack, and pop values from the stack, but all operations can only operate on the stack. And because of this, Wort may be called a *post-fix* language, one where every function call is written after all of its arguments. These striking differences from other mainstream languages can take some getting used to. But this style often promotes clean and simple programs; as a wise person once said of concatenative programming, "It's just one damn thing after another."

This document aims to be a detailed reference for the Wort programming language. Those wishing for a more basic introductory tutorial should look at the examples given in the repository.
