'use strict';

var forEach = require('./utils/for-each');
var lawyers = require('../input');

forEach(lawyers).inSeries(function(lawyer) {
  var Inquirer = require('./inquirer');
  var Emailer = require('./emailer');

  return Inquirer
    .inquireAbout(lawyer.clientNames)
    .then(function(results) {
      return Emailer.send(results, lawyer.email);
    })
    .catch(function(err) {
      console.error(err.stack);
    });
});
