wort
====

A very simple concatenative programming language which compiles down to JavaScript.

[![Build Status](https://travis-ci.org/robertkleffner/wort.svg?branch=master)](https://travis-ci.org/robertkleffner/wort)

## Installation

You must have NodeJS and NPM to run the wort compiler.

```shell
npm install wort
```

## Basic Usage

Wort transpiles .wort files to NodeJS modules.

```shell
wort hodor.wort
```

The transpiled file will be named `hodor.wort.js`. You can run this file by typing:

```shell
node hodor.wort.js
```

If you want your wort programs or modules to run in the browser, you can probably use the browserify tool on the output.

## Examples

A variation on the typical `Hello, World!` program.

```
# print a message to std out
main: "Hodor!" printz ;
```

Sum a list of numbers using `fold`, a built in function.

```
# sum a list of numbers (prints 15)
main: [1 2 3 4 5] 0 [+] fold;
```
