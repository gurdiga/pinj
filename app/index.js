'use strict';

function main() {
  assertEnvironment();
  console.log('Starting pinj-serch-engine in “' + process.env.NODE_ENV + '” mode');

  var newResultsContainer = {};

  return Promise.all([
    getUsers(),
    getNewResults()
  ])
  .then(storeNewResultsInto(newResultsContainer))
  .then(matchResultsToUsers)
  .then(prepareEmails)
  .then(sendEmails)
  .then(recordNewLastIDs(newResultsContainer))
  .then(exit)
  .catch(logErrors);
}

function assertEnvironment() {
  assertEnvironmentVariables([
    'FIREBASE_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS'
  ]);
}

function storeNewResultsInto(newResultsContainer) {
  return function(v) {
    newResultsContainer.value = v[1];
    return v;
  };
}

function exit() {
  process.exit(0);
}

function logErrors(error) {
  console.log('Error:', error.stack);
  process.exit(1);
}

var Promise = require('app/util/promise');
var assertEnvironmentVariables = require('app/util/assert-environment-variables');
var getUsers = require('app/get-users');
var getNewResults = require('app/get-new-results');
var matchResultsToUsers = require('app/match-results-to-user');
var prepareEmails = require('app/prepare-emails');
var sendEmails = require('app/send-emails');
var recordNewLastIDs = require('app/record-new-last-ids');

main();
