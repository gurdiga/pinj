'use strict';

function main() {
  console.log('Starting pinj-serch-engine in “' + process.env.NODE_ENV + '” mode');

  assertEnvironmentVariables()
  .then(getUserList)
  .then(processUsers)
  .then(disconnectFirebase)
  .catch(logErrorAndExit);
}

function assertEnvironmentVariables() {
  return Q.Promise(function(resolve) {
    [
      'FIREBASE_SECRET',
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASS'
    ].forEach(function(variable) {
      if (!process.env[variable]) throw new Error(variable + ' variable is expected to exist in the environment');
      resolve();
    });
  });
}

function processUsers(users) {
  console.log(users.length);
  return time(forEach(users).inSeries(processUser), '. Happy end!');
}

function disconnectFirebase() {
  // Prevent Firebase from hanging node.
  process.exit();
}

function logErrorAndExit(error) {
  console.error(error.stack);
  process.exit(1);
}

function processUser(user) {
  var action;

  if (user.clientList.length === 0) action = skip('. empty client list');
  else if (user.paymentOverdueNotification) action = skip('. payment overdue; already notified');
  else if (user.isPayer || user.isTrial) action = checkForNews(user);
  else action = sendPaymentOverdueNotification(user);

  return time(action, user.email);
}

function skip(reason) {
  console.log(reason);
  return new Q();
}

var time = require('app/util/time');
var forEach = require('app/util/for-each');
var getUserList = require('app/get-user-lists');
var checkForNews = require('app/check-for-news');
var sendPaymentOverdueNotification = require('app/send-payment-overdue-notification');
var Q = require('q');

main();
