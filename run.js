'use strict';

function main() {
  var script = process.argv[2];
  assert(script, 'Script to run is required: give it as the first argument');

  execute('node ' + script)
  .then(announceSuccess(script))
  .catch(announceFailure(script))
  .finally(exit);
}

function announceSuccess(script) {
  return function(stdIO) {
    var subject = 'PINJ cron success: ' + script;
    var body = '<pre>' + stdIO + '</pre>';

    return sendEmail('gurdiga@gmail.com', subject)({ html: body });
  };
}

function announceFailure(script) {
  return function(error) {
    var subject = 'PINJ cron failure: ' + script;
    var body = '<pre>' + error.stack + '</pre>';

    return sendEmail('gurdiga@gmail.com', subject)({ html: body });
  };
}

function exit() {
  process.exit(0);
}

var sendEmail = require('app/util/send-email');
var execute = require('app/util/execute');
var assert = require('assert');

main();
