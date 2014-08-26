'use strict';

function main() {
  ClientLists.getFor(payers)
  .then(function(payerClientLists) {
    return forEach(payerClientLists).inSeries(function(payer) {
      return Inquirer
      .inquireAbout(payer.clientList)
      .then(function(results) {
        return Curator.curate(results).for(payer.email);
      })
      .then(function(results) {
        return EmailFormatter.formatAsHTML(results);
      })
      .then(function(htmlContent) {
        return EmailSender.send(payer.email, htmlContent);
      });
    });
  })
  .catch(function(err) {
    if (err.message === 'No news') {
      console.log('No news');
      return;
    }

    console.error('Oh my! I’ve got an error!', err.stack);
    process.exit(1);
  })
  .then(function() {
    process.exit(0);
  });
}

var forEach = require('./util/for-each');
var ClientLists = require('./client-lists');
var Inquirer = require('./inquirer');
var Curator = require('./curator');
var EmailFormatter = require('./util/email/formatter');
var EmailSender = require('./util/email/sender');

var payers = require('../payers');

main();
