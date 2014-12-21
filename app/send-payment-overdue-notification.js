'use strict';

module.exports = sendPaymentOverdueNotification;

function sendPaymentOverdueNotification(user) {
  return ensureNotAlreadyNotified(user.aid)
  .then(prepareEmailBodies)
  .then(sendEmail(user.email, 'Monitorul PINJ: a expirat abonamentul'))
  .then(registerNotification(user.aid))
  .catch(handleErrors);
}

function ensureNotAlreadyNotified(aid) {
  return Data.get(getTimestampPath(aid))
  .then(function(timestamp) {
    var alreadyNotified = !!timestamp;
    if (alreadyNotified) throw new Error('Already notified');
  });
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
    return Data.set(getTimestampPath(aid), 'CURRENT_TIMESTAMP');
  };
}

function getTimestampPath(aid) {
  return '/data/' + aid + '/timestamps/paymentOverdueNotification';
}

function handleErrors(error) {
  if (error.message === 'Already notified') console.log('. payment overdue; already notified');
  else throw error;
}

var fs = require('fs');
var Data = require('app/util/data');
var sendEmail = require('app/send-email');
