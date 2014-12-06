'use strict';

var PaymentOverdueNotifier = {};

PaymentOverdueNotifier.notify = function(aid) {
  var timestampPath = '/data/' + aid + '/timestamps/paymentOverdueNotification';

  return Data.get(timestampPath)
  .then(function(alreadySent) {
    if (alreadySent) return;

    console.log('- sending notification');
    return Data.set(timestampPath, Firebase.ServerValue.TIMESTAMP)
    .then(function() {
      return fs.readFileSync(__dirname + '/email/payment-overdue-message-template.html', {encoding: 'utf8'});
    });
  });
};

module.exports = PaymentOverdueNotifier;

var fs = require('fs');
var Data = require('./data');
var Firebase = require('firebase');
