'use strict';

var _ = require('underscore');

var input = require('../input');

_(input).each(function(clientNames, email) {
  var Lawyer = require('./lawyer');
  var Inquirer = require('./inquirer');

  var lawyer = new Lawyer({
    email: email,
    clientNames: clientNames
  });

  var inquirer = new Inquirer();

  inquirer
    .inquireAbout(lawyer.getClientNames())
    .then(function(results) {
      var Emailer = require('./emailer');
      var emailer = new Emailer();

      //console.log(JSON.stringify(results, null, '  '));
      emailer.send(results, lawyer.email);
    })
    .catch(function(err) {
      console.error(err.stack);
    });
});
