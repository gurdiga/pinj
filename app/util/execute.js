'use strict';

module.exports = execute;

function execute(command) {
  return Q.Promise(function(resolve, reject) {
    var exec = require('child_process').exec;
    var child = exec(command, captureStreams);
    var stdErr, stdOut, exitCode;

    child.on('exit', captureExitCode);

    function captureStreams(error, stdout, stderr) {
      stdErr = stderr;
      stdOut = stdout;

      if (exitCode === 0) resolve(getStdIO());
      else reject(new Error(getErrorMessage()));
    }

    function captureExitCode(code) {
      exitCode = code;
    }

    function getErrorMessage() {
      return 'Command “' + command + '” exitted with the code of ' + exitCode + '\n' + getStdIO();
    }

    function getStdIO() {
      return 'STDOUT: \n' + stdOut + '\n' + 'STDERR: \n' + stdErr + '\n';
    }
  });
}

var Q = require('q');
