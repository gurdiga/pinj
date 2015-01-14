'use strict';

module.exports = sendPaymentOverdueNotification;

function sendPaymentOverdueNotification(user) {
  return new Q(prepareEmailBodies())
  .then(sendEmail(user.email, 'Monitorul PINJ: a expirat abonamentul'))
  .then(registerNotification(user.aid));
}

function prepareEmailBodies() {
  var bodies = {
    html: fs.readFileSync(__dirname + '/email-templates/payment-overdue-message.html', {encoding: 'utf8'}),
    text: fs.readFileSync(__dirname + '/email-templates/payment-overdue-message.txt', {encoding: 'utf8'})
  };

  return bodies;
}

function registerNotification(aid) {
  return function() {
    return Data.set('/data/' + aid + '/timestamps/paymentOverdueNotification', 'CURRENT_TIMESTAMP');
  };
}

var Q = require('q');
var fs = require('fs');
var Data = require('app/util/data');
var sendEmail = require('app/util/send-email');
