'use strict';

function main() {
  forEach(lawyerEmails).inSeries(function(lawyerEmail) {
    var clientNames = input[lawyerEmail];

    return Inquirer
      .inquireAbout(clientNames)
      .then(function(results) {
        return Curator.curate(results).for(lawyerEmail);
      })
      .then(function(results) {
        return EmailFormatter.formatAsHTML(results);
      })
      .then(function(htmlContent) {
        return EmailSender.send(lawyerEmail, htmlContent);
      })
      .catch(function(err) {
        if (err.message === 'No news') {
          console.log('No news');
          return;
        }

        console.error('Oh my! I’ve got an error!', err.stack);
      });
  });
}

var _ = require('underscore');
var forEach = require('./util/for-each');
var input = require('../input');
var lawyerEmails = _(input).keys();

var Inquirer = require('./inquirer');
var Curator = require('./curator');
var EmailFormatter = require('./util/email/formatter');
var EmailSender = require('./util/email/sender');

main();
