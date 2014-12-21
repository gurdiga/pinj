'use strict';

function run() {
  getUserList()
  .then(processUsers)
  .catch(logErrorAndExitWithErrorStatus)
  .then(exitEndingFirebaseConnection);
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


if (require.main === module) {
  run();
} else {
  module.exports.run = run;
}
