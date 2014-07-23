'use strict';

var Lawyer = require('./lawyer');
var Inquirer = require('./inquirer');

var lawyer = new Lawyer({
  email: 'gurdiga@gmail.com',
  clientNames: ['Romanescu Constantin', 'Cebanu Valentina']
});

var inquirer = new Inquirer();

inquirer.inquireAbout(lawyer.getClientNames())
.then(function(results) {
  var Emailer = require('./emailer');
  var emailer = new Emailer();

  emailer.send({
    results: results,
    address: lawyer.email
  });
})
.catch(function(err) {
  console.error(err.stack);
});
