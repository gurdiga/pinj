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
      })
      .catch(function(error) {
        if (error.message === 'No news') console.log('No news');
        else throw error;
      });
    });
  })
  .catch(logTheErrorAndExit)
  .then(function() {
    process.exit(0);
  });
}

function logTheErrorAndExit(error) {
  console.error('Oh my! I’ve got an error!', error.stack);
  process.exit(1);
}

var forEach = require('./util/for-each');
var ClientLists = require('./client-lists');
var Inquirer = require('./inquirer');
var Curator = require('./curator');
var EmailFormatter = require('./email-formatter');
var EmailSender = require('./email-sender');

var payers = require('../payers');

main();
