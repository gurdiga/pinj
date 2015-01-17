'use strict';

var JOB_DEFINITIONS = [{
  'schedule': process.env.SEARCH_SCHEDULE,
  'command' : 'node app/index'
}, {
  'schedule': process.env.PURGE_SCHEDULE,
  'command' : 'node app/crontab/purge-search-history'
}];

function main() {
  console.log('Starting cron');

  assertEnvironmentVariables([
    'SEARCH_SCHEDULE',
    'PURGE_SCHEDULE'
  ]);

  JOB_DEFINITIONS.forEach(function(job) {
    new CronJob(job.schedule, executeCommand(job.command), null, true, 'Europe/Chisinau');
  });
}

function executeCommand(command) {
  return function() {
    execute(command).then(notify).catch(notify);
  };
}

function notify(result) {
  var subject, body;

  if (result instanceof Error) {
    subject ='Monitorul PINJ: eroare';
    body = result.message;
  } else {
    subject ='Monitorul PINJ: executat cu success';
    body = 'Yes';
  }

  sendEmail('gurdiga@gmail.com', subject)({ html: body });
}

var CronJob = require('cron').CronJob;
var sendEmail = require('app/util/send-email');
var execute = require('app/util/execute');
var assertEnvironmentVariables = require('app/util/assert-environment-variables');

main();
