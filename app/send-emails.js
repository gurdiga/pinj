'use strict';

module.exports = sendEmails;

function sendEmails(emails) {
  return forEach(emails).inParallel(function(meta) {
    var email = meta.label;
    var subject = 'Monitorul PINJ: informaţii despre clienţi';
    var bodies = meta.results;

    return sendEmail(email, subject)(bodies);
  });
}

var forEach = require('app/util/for-each');
var sendEmail = require('app/util/send-email');
