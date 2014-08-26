'use strict';

var EmailSender = {};

EmailSender.send = function send(address, htmlContent) {
  var emailOptions = {
    to: address,
    html: htmlContent,
    text: 'Please use an email program capable of rendering HTML messages',
    from: 'info@pinj.pentru.md',
    subject: 'Informaţii PINJ'
  };

  var transport = getTransport();

  return Q.ninvoke(transport, 'sendMail', emailOptions);
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
