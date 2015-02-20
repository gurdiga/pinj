'use strict';

var JOB_DEFINITIONS = [{
  'schedule': process.env.SEARCH_SCHEDULE,
  'command' : './time --verbose node app/index'
}, {
  'schedule': process.env.PURGE_SCHEDULE,
  'command' : './time --verbose node app/crontab/purge-search-history'
}];

function main() {
  console.log('Starting cron');

  assertEnvironmentVariables([
    'SEARCH_SCHEDULE',
    'PURGE_SCHEDULE'
  ]);

  JOB_DEFINITIONS.forEach(function(job) {
    new CronJob(job.schedule, getPreparedExecution(job.command), null, true, 'Europe/Chisinau');
  });
}

function getPreparedExecution(command) {
  return function() {
    console.log('executing', command);
    execute(command)
    .then(announceSuccess(command))
    .catch(announceFailure(command));
  };
}

function announceSuccess(command) {
  return function(stdIO) {
    var subject = 'PINJ cron success: ' + command;
    var body = '<pre>' + stdIO + '</pre>';

    return sendEmail('gurdiga@gmail.com', subject)({ html: body });
  };
}

function announceFailure(command) {
  return function(error) {
    var subject = 'PINJ cron failure: ' + command;
    var body = '<pre>' + error.stack + '</pre>';

    return sendEmail('gurdiga@gmail.com', subject)({ html: body });
  };
}

var CronJob = require('cron').CronJob;
var sendEmail = require('app/util/send-email');
var execute = require('app/util/execute');
var assertEnvironmentVariables = require('app/util/assert-environment-variables');

main();
