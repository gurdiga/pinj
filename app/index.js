'use strict';

var _ = require('underscore');
var forEach = require('./utils/for-each');
var input = require('../input');
var lawyerEmails = _(input).keys();

forEach(lawyerEmails).inSeries(function(lawyerEmail) {
  var Inquirer = require('./inquirer');
  var Curator = require('./curator');
  var EmailFormatter = require('./email/formatter');
  var EmailSender = require('./email/sender');

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
