'use strict';

module.exports = sendEmails;

function sendEmails(emails) {
  return time('. sending emails', forEach(emails).inParallel(function(meta) {
    var email = meta.label;
    var subject = 'Monitorul PINJ: informaţii despre clienţi';
    var bodies = meta.results;

    return sendEmail(email, subject)(bodies);
  }))
  .then(reportEmailCount(emails));
}

function reportEmailCount(emails) {
  return function(v) {
    console.log('.. %s emails sent', emails.length);
    return v;
  };
}

var sendEmail = require('app/util/send-email');
var forEach = require('util-for-each');
var time = require('app/util/time');
