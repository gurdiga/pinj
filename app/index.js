'use strict';

function main() {
  console.log('Starting pinj-serch-engine in “' + process.env.NODE_ENV + '” mode');

  assertEnvironment();

  return Promise.all([
    getUsers,
    getNewRows
  ])
  .then(matchRowsToUsers)
  .then(prepareEmailBodies)
  .then(sendEmails)
  .then(recordLastIDs)
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

function getNewRows() {
}

function matchRowsToUsers() {
}

function prepareEmailBodies() {
}

function sendEmails() {
}

function recordLastIDs() {
}

function logErrors() {
}

var Promise = require('app/util/promise');
var assertEnvironmentVariables = require('app/util/assert-environment-variables');
var getUsers = require('app/get-users');

main();
