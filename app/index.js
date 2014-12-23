'use strict';

function run() {
  assertEnvironmentVariables()
  .then(getUserList)
  .then(processUsers)
  .catch(logErrorAndExitWithErrorStatus)
  .then(exitEndingFirebaseConnection);
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
      assert(process.env[variable], variable + ' variable is expected to exist in the environment');
      resolve();
    });
  });
}

function processUsers(users) {
  return forEach(users).inSeries(processUser);
}

function processUser(user) {
  var action;

  if (user.clientList.length === 0) action = skip('. empty client list');
  else if (user.isPayer || user.isTrial) action = checkForNews(user);
  else action = sendPaymentOverdueNotification(user);

  return time(action, user.email);
}

function exitEndingFirebaseConnection() {
  process.exit(0);
}

function logErrorAndExitWithErrorStatus(error) {
  console.error('Oh my! I’ve got an error!', error.stack);
  process.exit(1);
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
var assert = require('assert');


if (require.main === module) {
  run();
} else {
  module.exports.run = run;
}
