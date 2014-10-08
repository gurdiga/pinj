'use strict';

function main() {
  ClientLists.get()
  .then(function(payerClientLists) {
    return forEach(payerClientLists).inSeries(function(payer) {
      return time(Inquirer
      .inquireAbout(payer.clientList)
      .then(function(results) {
        return Curator.curate(results).for(payer.email);
      })
      .then(function(results) {
        return EmailFormatter.formatAsHTML(results);
      })
      .then(function(htmlContent) {
        if (process.env.NODE_ENV === 'development') return;
        else return EmailSender.send(payer.email, htmlContent);
      })
      .catch(function(error) {
        if (error.message === 'No news') console.log('No news');
        else throw error;
      }), payer);
    });
  })
  .catch(logTheErrorAndExit)
  .then(exitEndingFirebaseConnection);
}

function exitEndingFirebaseConnection() {
  process.exit(0);
}

function logTheErrorAndExit(error) {
  console.error('Oh my! I’ve got an error!', error.stack);
  process.exit(1);
}

var time = require('./util/time');
var forEach = require('./util/for-each');
var ClientLists = require('./client-lists');
var Inquirer = require('./inquirer');
var Curator = require('./curator');
var EmailFormatter = require('./email-formatter');
var EmailSender = require('./email-sender');

main();
