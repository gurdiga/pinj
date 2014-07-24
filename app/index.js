'use strict';

var _ = require('underscore');
var forEach = require('./utils/for-each');
var input = require('../input');
var lawyerEmails = _(input).keys();

forEach(lawyerEmails).inSeries(function(lawyerEmail) {
  var Inquirer = require('./inquirer');
  var EmailFormatter = require('./email/formatter');
  var EmailSender = require('./email/sender');

  var clientNames = input[lawyerEmail];

  return Inquirer
    .inquireAbout(clientNames)
    .then(function(results) {
      return EmailFormatter.formatAsHTML(results);
    })
    .then(function(htmlContent) {
      //console.log('sending %s bytes to %s', htmlContent.length, lawyerEmail);
      return EmailSender.send(lawyerEmail, htmlContent);
    })
    .catch(function(err) {
      console.error('Oh my! I’ve got an error!', err.stack);
    });
});
