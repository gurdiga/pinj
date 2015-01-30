'use strict';

function main() {
  console.log('Starting pinj-serch-engine in “' + process.env.NODE_ENV + '” mode');

  assertEnvironment();

  return Promise.all([
    getUsers(),
    getNewRows()
  ])
  .then(findMatchingRowsForEachUser)
  .then(prepareEmailBodies)
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

function prepareEmailBodies() {
}

function sendEmails() {
}

function recordNewLastIDs() {
}

function logErrors(error) {
  console.log('Error:', error.stack);
}

var Promise = require('app/util/promise');
var assertEnvironmentVariables = require('app/util/assert-environment-variables');
var getUsers = require('app/get-users');
var getNewRows = require('app/get-new-rows');
var findMatchingRowsForEachUser = require('app/find-matching-rows-for-each-user');

main();
