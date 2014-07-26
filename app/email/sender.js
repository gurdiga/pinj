'use strict';

var EmailSender = {};

EmailSender.send = function(address, htmlContent) {
  var emailOptions = {
    to: address,
    html: htmlContent,
    text: 'Please use an email program capable of rendering HTML messages',
    from: 'info@pinj.pentru.md',
    subject: 'Informaţii PINJ'
  };

  var transport = getTransport();
  var deferred = Q.defer();

  transport.sendMail(emailOptions, function(err) {
    if (err) deferred.reject(new Error(err));
    else deferred.resolve();
  });

  return deferred.promise;
};

function getTransport() {
  var transportOptions = {};
  var transport = require('nodemailer-smtp-transport');

  return nodemailer.createTransport(transport(transportOptions));
}

module.exports = EmailSender;

var nodemailer = require('nodemailer');
var Q = require('q');
Q.longStackSupport = true;
