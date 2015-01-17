'use strict';

module.exports = execute;

function execute(command) {
  return Q.Promise(function(resolve, reject) {
    var exec = require('child_process').exec;
    var child = exec(command);

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', checkExitCode);

    function checkExitCode(code) {
      if (code === 0) resolve();
      else reject(new Error('Command “' + command + '” exitted with the code of ' + code));
    }
  });
}

var Q = require('q');
