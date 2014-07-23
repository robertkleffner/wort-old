#!/usr/bin/python

import os
import sys

BUILT_IN_FUNCS = [
    # sigh... why
    'null',

    # boolean literals
    'true', 'false',

    # basic combinators
    'zap', 'dup', 'swap', 'cat', 'cons', 'unit', 'i', 'dip',

    # numeric operations
    'neg',

    # questions
    'null?', 'typeof',

    # utilities
    'clear', 'print', 'printp',
]

OPERATORS = {
    # arithmetic operators
    '+': 'add', '-': 'sub', '*': 'mul', '/': 'div', '%': 'rem', '++': 'inc', '--': 'dec',
    # bitwise operators
    '~': 'complement', '&': 'band', '|': 'bor', '^': 'xor', '<<': 'shl', '>>': 'shr', '>>>': 'shr_u',
    # logical operators
    '&&': 'and', '||': 'or', '!': 'not',
    # comparison operators
    '=': 'same', '!=': 'notsame', '==': 'eq', '!==': 'noteq',
    '<': 'less', '<=': 'lesseq', '>': 'greater', '>=': 'greatereq',
    # object access operators
    '->': 'set_valobj', '<-': 'set_objval', '@': 'get_prop',
}

NAME = 'NAME'
BUILT_IN = 'BUILT_IN'
SYMBOL = 'SYMBOL'
OPERATOR = 'OPERATOR'
NUMBER = 'NUMBER'
STRING = 'STRING'
OBJECT = 'OBJECT'
PROPERTY = 'PROPERTY'
INLINE_JS = 'INLINE_JS'

_quote_nest = 0

def mash():
    if len(sys.argv) < 2:
        print('usage: mash.py filename')
    else:
        parseFile(sys.argv[1])

def parseFile(filename):
    inputFile = open(filename, "r")
    inputString = inputFile.read()
    tokens = lex(inputString.strip(' \t\n\r'));
    defs = {}

    while len(tokens) != 0:
        result = parseDefinition(tokens)
        if result is None:
            return
        defs[result[0]] = result[1]

    module, extension = os.path.splitext(filename)
    transpile(module, defs)

def parseDefinition(tokens):
    name = tokens.pop(0)
    if name[0] != NAME:
        print('bad function definition name, should only be alphanumeric or dots: ' + name[1] + ', line ' + str(name[2]))
        return None

    defSep = tokens.pop(0)
    if defSep[0] != SYMBOL or defSep[1] != ':':
        print('incorrect function definition format, name should be followed by ":" after ' + name[1] + ' got ' + defSep[0] + ' at line ' + str(defSep[2]))
        return None

    terms = []
    term = tokens.pop(0)
    while len(tokens) > 0 and term[0] != SYMBOL or term[1] != ';':
        terms.append(term)
        term = tokens.pop(0)

    if term[1] != ';':
        print('function definition must end with a semicolon in function ' + name[1] + ', line ' + str(term[2]))

    return (name[1], terms)

def transpile(module, defs):
    output = module + ' = {};\n\n'

    for key, value in defs.iteritems():
        output += transpileFunc(module, key, value)
    output += makePrelude(module)

    outputFile = open(module + ".js", "w")
    outputFile.write(output)
    outputFile.close()

def transpileFunc(module, name, terms):
    output = module + '.' + name + ' = function(stack, index) {\n'
    for term in terms:
        output += '    ' + transpileTerm(term) + '\n'
    output += '};\n\n'
    return output

def transpileTerm(term):
    global _quote_nest

    if _quote_nest == 0:
        if term[0] == NUMBER or term[0] == STRING or term[0] == OBJECT:
            return 'stack[++wort.ind] = ' + term[1] + ';'
        if term[0] == BUILT_IN:
            # TODO: use inline js here if it's available
            # return BUILT_IN_FUNCS[term[1]]
            return 'wort.' + term[1].replace('?', '$') + '(stack);'
        if term[0] == INLINE_JS:
            return term[1]
        if term[0] == OPERATOR:
            # TODO: use inline js here if it's available
            # return BUILT_IN_FUNCS[term[1]]
            return 'wort.' + OPERATORS[term[1]] + '(stack);'
        if term[0] == SYMBOL:
            if term[1] == '[':
                _quote_nest += 1
                return "stack[++wort.ind] = ["
            if term[1] == ']':
                print("too many end quotation brackets ']', line " + term[2])
        if term[0] == PROPERTY:
            if term[1][0] == '@':
                return 'wort.get_prop(stack,"' + term[1][1:len(term[1])] + '");'
            if term[1][0] == '-':
                return 'wort.set_valobj(stack,"' + term[1][2:len(term[1])] + '");'
            if term[1][0] == '<':
                return 'wort.set_objval(stack,"' + term[1][2:len(term[1])] + '");'
        return term[1] + '(stack);'
    else:
        if term[0] == NUMBER or term[0] == STRING or term[0] == NAME or term[0] == OBJECT:
            return term[1] + ','
        if term[0] == BUILT_IN:
            return 'wort.' + term[1] + ','
        if term[0] == OPERATOR:
            return 'wort.' + OPERATORS[term[1]] + '(stack);'
        if term[0] == PROPERTY:
            if term[1][0] == '@':
                return 'wort.get_prop(stack,"' + term[1][1:len(term[1])] + '");'
            if term[1][0] == '-':
                return 'wort.set_valobj(stack,"' + term[1][2:len(term[1])] + '");'
            if term[1][0] == '<':
                return 'wort.set_objval(stack,"' + term[1][2:len(term[1])] + '");'
        if term[0] == SYMBOL:
            if term[1] == '[':
                _quote_nest += 1
                return '['
            if term[1] == ']':
                _quote_nest -= 1
                if _quote_nest == 0:
                    return '];'
                else:
                    return '],'

def lex(fileInput):
    pos = 0
    line = 1
    tokens = []

    while pos < len(fileInput):
        # skip whitespace
        while fileInput[pos].isspace():
            if fileInput[pos] == '\n':
                line += 1
            pos += 1

        # skip line comments
        if fileInput[pos] == '#':
            while fileInput[pos] != '\n':
                pos += 1
            continue

        # inline javascript
        elif fileInput.find('~~~', pos) == pos:
            start = pos + 3
            pos += 1
            while fileInput.find('~~~', pos) != pos:
                pos += 1
            tokens.append((INLINE_JS, fileInput[start:pos]))
            pos += 3

        # object literal
        elif fileInput[pos] == '{':
            start = pos
            pos += 1
            nest = 1
            while nest != 0:
                if fileInput[pos] == '}':
                    nest -= 1
                if fileInput[pos] == '{':
                    nest += 1
                pos += 1
            tokens.append((OBJECT, fileInput[start:pos]))

        # object modification syntax
        elif (fileInput.find('->', pos) == pos or fileInput.find('<-', pos) == pos) and fileInput[pos+2].isalpha():
            start = pos
            pos += 2
            while fileInput[pos].isalnum() or fileInput[pos] == '.' or fileInput[pos] == '_':
                pos += 1
            tokens.append((PROPERTY, fileInput[start:pos]))

        # object property read syntax
        elif fileInput[pos] == '@' and fileInput[pos+1].isalpha():
            start = pos
            pos += 1
            while fileInput[pos].isalnum() or fileInput[pos] == '.' or fileInput[pos] == '_':
                pos += 1
            tokens.append((PROPERTY, fileInput[start:pos]))

        # get string literals
        elif fileInput[pos] == '"':
            start = pos
            pos += 1
            while fileInput[pos] != '"':
                if fileInput[pos] == '\\':
                    pos += 2
                else:
                    pos += 1

                if len(fileInput) <= pos:
                    print('unterminated string at end of file')
                    return []

            pos += 1
            tokens.append((STRING, fileInput[start:pos]))

        # number literals
        elif fileInput[pos].isdigit() or (fileInput[pos] == '-' and fileInput[pos+1].isdigit()):
            start = pos
            pos += 1

            # start out getting an int literal
            while fileInput[pos].isdigit():
                pos += 1
            # check for decimal for floating point
            if fileInput[pos] == '.':
                pos += 1
            # get the rest of the number if there is any
            while fileInput[pos].isdigit():
                pos += 1

            tokens.append((NUMBER, fileInput[start:pos]))

        # symbols
        elif fileInput[pos] == ':' or fileInput[pos] == ';' or fileInput[pos] == '[' or fileInput[pos] == ']':
            tokens.append((SYMBOL, fileInput[pos]))
            pos += 1

        # operators
        elif not fileInput[pos].isalpha():
            longest = ''
            for key in OPERATORS:
                if fileInput.find(key, pos) == pos:
                    if len(key) > len(longest):
                        longest = key
            if longest == '':
                print('bad beginning of token: ' + fileInput[pos])
                return []
            else:
                pos += len(longest)
                tokens.append((OPERATOR, longest))

        # built ins and user names
        else:
            longest = ''
            for key in BUILT_IN_FUNCS:
                if fileInput.find(key, pos) == pos:
                    if len(key) > len(longest):
                        longest = key

            temp = pos
            start = temp
            while fileInput[temp].isalnum() or fileInput[temp] == '.' or fileInput[temp] == '_' or fileInput[temp] == '?':
                temp += 1
            name = fileInput[start:temp]

            if len(name) > len(longest):
                pos = temp
                tokens.append((NAME, fileInput[start:pos]))
            else:
                pos += len(longest)
                tokens.append((BUILT_IN, longest))

        t = tokens[len(tokens) - 1]
        tokens[len(tokens) - 1] = (t[0], t[1], line)

    return tokens

def makePrelude(module):
    output = ''
    output += 'wort = {};\n\n'

    # primary interpreter function! key candidate for optimizations
    output += 'wort.exec = function(quote, stack) {\n'
    output += '    for (var i = 0; i < quote.length; i++) {\n'
    output += '        if (quote[i] instanceof Function) {\n'
    output += '            quote[i](stack);\n'
    output += '        } else {\n'
    output += '            stack[++wort.ind] = quote[i];\n'
    output += '        }\n'
    output += '    }\n'
    output += '};\n\n'

    # this pains me
    output += 'wort.null = function(stack) { stack[++wort.ind] = null; };\n'

    # some basic combinators
    output += 'wort.true = function(stack) { stack[++wort.ind] = true; };\n'
    output += 'wort.false = function(stack) { stack[++wort.ind] = false; };\n'
    output += 'wort.zap = function(stack) { wort.ind--; };\n'
    output += 'wort.dup = function(stack) { stack[++wort.ind] = stack[wort.ind-1]; };\n'
    output += 'wort.swap = function(stack) {\n'
    output += '    var tmp = stack[wort.ind];\n'
    output += '    stack[wort.ind] = stack[wort.ind-1];\n'
    output += '    stack[wort.ind-1] = tmp;\n'
    output += '};\n'
    output += 'wort.cat = function(stack) { stack[--wort.ind] = stack[wort.ind].concat(stack[wort.ind+1]); };\n'
    output += 'wort.cons = function(stack) { stack[wort.ind].unshift(stack[--wort.ind]);stack[wort.ind]=stack[wort.ind+1]; };\n'
    output += 'wort.unit = function(stack) { stack[wort.ind] = [stack[wort.ind]]; };\n'
    output += 'wort.i = function(stack) { wort.exec(stack[wort.ind--], stack); };\n'
    output += 'wort.dip = function(stack) {\n';
    output += '    var top = stack[wort.ind--];\n'
    output += '    var next = stack[wort.ind--];\n'
    output += '    wort.exec(top, stack);\n'
    output += '    stack[++wort.ind] = next;\n'
    output += '};\n'

    # arithmetic operators
    output += 'wort.add = function(stack) { stack[--wort.ind] = stack[wort.ind] + stack[wort.ind+1]; };\n'
    output += 'wort.sub = function(stack) { stack[--wort.ind] = stack[wort.ind] - stack[wort.ind+1]; };\n'
    output += 'wort.mul = function(stack) { stack[--wort.ind] = stack[wort.ind] * stack[wort.ind+1]; };\n'
    output += 'wort.div = function(stack) { stack[--wort.ind] = stack[wort.ind] / stack[wort.ind+1]; };\n'
    output += 'wort.rem = function(stack) { stack[--wort.ind] = stack[wort.ind] % stack[wort.ind+1]; };\n'
    output += 'wort.inc = function(stack) { stack[wort.ind]++; };\n'
    output += 'wort.dec = function(stack) { stack[wort.ind]--; };\n'
    output += 'wort.neg = function(stack) { stack[wort.ind] = -stack[wort.ind]; };\n'

    # bitwise operators
    output += 'wort.complement = function(stack) { stack[wort.ind] = ~stack[wort.ind]; };\n'
    output += 'wort.band = function(stack) { stack[--wort.ind] = stack[wort.ind] & stack[wort.ind+1]; };\n'
    output += 'wort.bor = function(stack) { stack[--wort.ind] = stack[wort.ind] | stack[wort.ind+1]; };\n'
    output += 'wort.xor = function(stack) { stack[--wort.ind] = stack[wort.ind] ^ stack[wort.ind+1]; };\n'
    output += 'wort.shl = function(stack) { stack[--wort.ind] = stack[wort.ind] << stack[wort.ind+1]; };\n'
    output += 'wort.shr = function(stack) { stack[--wort.ind] = stack[wort.ind] >> stack[wort.ind+1]; };\n'
    output += 'wort.shr_u = function(stack) { stack[--wort.ind] = stack[wort.ind] >>> stack[wort.ind+1]; };\n'

    # logical operators
    output += 'wort.and = function(stack) { stack[--wort.ind] = stack[wort.ind] && stack[wort.ind+1]; };\n'
    output += 'wort.or = function(stack) { stack[--wort.ind] = stack[wort.ind] || stack[wort.ind+1]; };\n'
    output += 'wort.not = function(stack) { stack[wort.ind] = !stack[wort.ind]; };\n'

    # comparison operators
    output += 'wort.same = function(stack) { stack[++wort.ind] = stack[wort.ind-2] == stack[wort.ind-1]; };\n'
    output += 'wort.notsame = function(stack) { stack[++wort.ind] = stack[wort.ind-2] != stack[wort.ind-1]; };\n'
    output += 'wort.eq = function(stack) { stack[++wort.ind] = stack[wort.ind-2] === stack[wort.ind-1]; };\n'
    output += 'wort.noteq = function(stack) { stack[++wort.ind] = stack[wort.ind-2] !== stack[wort.ind-1]; };\n'
    output += 'wort.less = function(stack) { stack[++wort.ind] = stack[wort.ind-2] < stack[wort.ind-1]; };\n'
    output += 'wort.lesseq = function(stack) { stack[++wort.ind] = stack[wort.ind-2] <= stack[wort.ind-1]; };\n'
    output += 'wort.greater = function(stack) { stack[++wort.ind] = stack[wort.ind-2] > stack[wort.ind-1]; };\n'
    output += 'wort.greatereq = function(stack) { stack[++wort.ind] = stack[wort.ind-2] >= stack[wort.ind-1]; };\n'

    # access operators
    output += 'wort.set_valobj = function(stack, name) {\n'
    output += '    name = name || stack[wort.ind--];\n'
    output += '    var obj = stack[wort.ind--];\n'
    output += '    obj[name] = stack[wort.ind];\n'
    output += '    stack[wort.ind] = obj;\n'
    output += '};\n'
    output += 'wort.set_objval = function(stack, name) {\n'
    output += '    name = name || stack[wort.ind--];\n'
    output += '    stack[wort.ind-1][name] = stack[wort.ind--];\n'
    output += '};\n'
    output += 'wort.get_prop = function(stack, name) {\n'
    output += '    name = name || stack[wort.ind--];\n'
    output += '    stack[++wort.ind] = stack[wort.ind-1][name];\n'
    output += '};\n'

    # questions
    output += 'wort.null$ = function(stack) { stack[++wort.ind] = stack[wort.ind-1] == null; };\n'
    output += 'wort.typeof = function(stack) { stack[++wort.ind] = typeof stack[wort.ind-1]; };\n'

    # utility functions
    output += 'wort.clear = function(stack) { stack.length = 0; };\n'
    output += 'wort.print = function(stack) { console.log(stack[wort.ind]); };\n'
    output += 'wort.printp = function(stack) { console.log(stack[wort.ind--]); };\n'

    # setup and run
    output += 'wort.ind = -1;\n'
    output += 'wort.run = function () {\n'
    output += '    var stack = [];\n'
    output += '    ' + module + '.main(stack);\n'
    output += '};\n\nwort.run();'
    return output

mash()
