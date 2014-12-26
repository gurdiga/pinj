'use strict';

function main() {
  new CronJob('0 1,3 * * *', runSearch).start();
}

function runSearch() {
  var emailBodies;

  try {
    app.run();
    notify('Monitorul PINJ: executat cu success', 'Yes.');
  } catch(error) {
    console.error(error.stack);
    notify('Monitorul PINJ: eroare', error.stack);
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
var app = require('app');
var sendEmail = require('app/util/send-email');

main();
