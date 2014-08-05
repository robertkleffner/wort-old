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

Wort transpiles .wort files to NodeJS modules by default.

```shell
wort hodor.wort
```

The transpiled file will be named `hodor.wort.js`.
You can specify your target using the `-t` option.

```shell
wort -t browser file1.wort file2.wort ...
wort -t node file1.wort file2.wort ...
```

Currently the only targets are `browser` and `node`.

## Hodor

A variation on the typical `Hello, World!` program.

```
# print a message to std out
Main: "Hodor!" printz ;
```
