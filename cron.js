'use strict';

var jobs = [{
  'schedule': '0 1,3 * * *',
  'action'  : runSearch
}];

function main() {
  jobs.forEach(function(job) {
    new CronJob(job.schedule, job.action, null, true, 'Europe/Chisinau');
  });
}

function runSearch() {
  var exec = require('child_process').exec;
  var child = exec('node app');

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on('exit', checkExitCode);

  function checkExitCode(code) {
    if (code === 0) {
      notify('Monitorul PINJ: executat cu success', 'Yes.');
    } else {
      notify('Monitorul PINJ: eroare', code);
    }
  }
}

function notify(subject, body) {
  var emailBodies = {
    html: '<pre>' + body + '</pre>',
    text: body
  };

  sendEmail('gurdiga@gmail.com', subject)(emailBodies);
}

var CronJob = require('cron').CronJob;
var sendEmail = require('app/util/send-email');

main();
