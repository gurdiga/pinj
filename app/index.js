'use strict';

var forEach = require('./utils/for-each');
var lawyers = require('../input');

forEach(lawyers).inSeries(function(lawyer) {
  var Inquirer = require('./inquirer');
  var EmailFormatter = require('./email/formatter');
  var EmailSender = require('./email/sender');

  return Inquirer
    .inquireAbout(lawyer.clientNames)
    .then(function(results) {
      return EmailFormatter.formatAsHTML(results);
    })
    .then(function(htmlContent) {
      return EmailSender.send(lawyer.email, htmlContent);
    })
    .catch(function(err) {
      console.error('Oh my! I’ve got an error!', err.stack);
    });
});
