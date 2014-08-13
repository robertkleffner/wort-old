#!/usr/bin/env node

var program = require('commander'),
    fs = require('fs'),
    l = require('./lex'),
    p = require('./parse'),
    s = require('./semantics'),
    t = require('./transpile');

program
    .version('0.1.4')
    .usage('<files>')
    .parse(process.argv);

if (!program.args.length) {
    program.help();
    process.exit(0);
}

var files = program.args;
var error = false;

for (var i = 0; i < files.length; i++) {
    var filename = files[i];
    fs.readFile(filename, {encoding: 'utf-8'}, function(err, data) {
        if (err) {
            console.log('Could not read file "' + files[i] + '", file may not exist');
            process.exit(1);
        }

        var name = filename.split('/');
        name = name[name.length-1];
        name = name.split('.')[0];

        var mod = p.parse(l.lex(data), name);

        if (mod.err) {
            return console.log(mod.err.value + ', line ' + mod.err.line);
        }

        mod = s.analyze(mod);
        if (mod.analysisErrors.length > 0) {
            for (var i = 0; i < mod.analysisErrors.length; i++) {
                console.log(mod.analysisErrors[i].value + ', ' + mod.analysisErrors[i].line);
            }
            return;
        }

        var output = t.transpile(mod);

        fs.writeFile(filename + '.js', output, function(err) {
            if (err) {
                console.log('Error: Transpiled "' + filename + '" successfully, but could not save the output.');
            } else {
                console.log('Transpiled "' + filename + '" successfully!');
            }
        });
    });
}
