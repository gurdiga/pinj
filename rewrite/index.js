'use strict';

var _ = require('underscore');
var input = require('../input');

_(input).each(function(clientNames, email) {
  var Lawyer = require('./lawyer');
  var Inquirer = require('./inquirer');
  var Emailer = require('./emailer');

  var lawyer = new Lawyer({
    email: email,
    clientNames: clientNames
  });

  Inquirer
    .inquireAbout(lawyer.getClientNames())
    .then(function(results) {
      Emailer.send(results, lawyer.email);
    })
    .catch(function(err) {
      console.error(err.stack);
    });
});
