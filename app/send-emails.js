'use strict';

module.exports = sendEmails;

function sendEmails(emails) {
  return time('. sending emails', forEach(emails).inParallel(function(meta) {
    return sendEmail({
      'from': 'info@pinj.pentru.md',
      'to': meta.label,
      'subject': 'Monitorul PINJ: informaţii despre clienţi (next)',
      'html': meta.results.html,
      'text': meta.results.text
    });
  }))
  .then(reportEmailCount(emails));
}

function reportEmailCount(emails) {
  return function(v) {
    console.log('.. %s emails sent', emails.length);
    return v;
  };
}

var sendEmail = require('util-send-email');
var forEach = require('util-for-each');
var time = require('app/util/time');
