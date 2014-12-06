'use strict';

function main() {
  ClientLists.get()
  .then(function(users) {
    return forEach(users).inSeries(function(user) {
      if (user.isPayer || user.isTrial) {
        return time(Inquirer.inquireAbout(user.clientList)
        .then(function(results) {
          return Curator.curate(results).for(user.email);
        })
        .then(function(results) {
          return EmailFormatter.formatAsHTML(results);
        })
        .then(function(htmlContent) {
          return EmailSender.send(user.email, 'Monitorul PINJ: informaţii despre clienţi', htmlContent);
        })
        .catch(function(error) {
          if (error.message === 'No news') console.log(error.message);
          else throw error;
        }), user.email);
      } else {
        if (user.clientList.length > 0) {
          return time(PaymentOverdueNotifier.notify(user.aid)
          .then(function(htmlContent) {
            return EmailSender.send(user.email, 'Monitorul PINJ: a expirat abonamentul', htmlContent);
          }), user.email + ' - payment overdue');
        }
      }
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
var PaymentOverdueNotifier = require('./payment-overdue-notifier');

main();
