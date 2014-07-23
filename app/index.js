'use strict';

var _ = require('underscore');
var input = require('../input');

_(input).each(function(clientNames, email) {
  var lawyer = {
    email: email,
    clientNames: clientNames
  };

  var Inquirer = require('./inquirer');
  var Emailer = require('./emailer');

  Inquirer
    .inquireAbout(lawyer.clientNames)
    .then(function(results) {
      Emailer.send(results, lawyer.email);
    })
    .catch(function(err) {
      console.error(err.stack);
    });
});
