'use strict';

function main() {
  console.log('Starting pinj-serch-engine in “' + process.env.NODE_ENV + '” mode');

  assertEnvironment();

  return Promise.all([
    getUsers(),
    getNewRows()
  ])
  .then(matchResultsToUsers)
  .then(prepareEmails)
  .then(sendEmails)
  .then(recordNewLastIDs)
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

function recordNewLastIDs() {
  console.log('recordNewLastIDs: TODO');
  process.exit();
}

function logErrors(error) {
  console.log('Error:', error.stack);
  process.exit(1);
}

var Promise = require('app/util/promise');
var assertEnvironmentVariables = require('app/util/assert-environment-variables');
var getUsers = require('app/get-users');
var getNewRows = require('app/get-new-rows');
var matchResultsToUsers = require('app/match-results-to-user');
var prepareEmails = require('app/prepare-emails');
var sendEmails = require('app/send-emails');

main();
