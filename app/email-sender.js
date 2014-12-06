'use strict';

var EmailSender = {};

EmailSender.send = function send(address, subject, htmlContent) {
  if (process.env.NODE_ENV === 'development' && address !== 'gurdiga@gmail.com') return Q.delay(0);

  var emailOptions = {
    to: address,
    html: htmlContent,
    text: 'Please use an email program capable of rendering HTML messages',
    from: 'info@pinj.pentru.md',
    subject: subject
  };

  var transport = getTransport();

  return Q.ninvoke(transport, 'sendMail', emailOptions);
};

function getTransport() {
  var transportOptions = {
    'host': secrets.SMTP_HOST,
    'port': secrets.SMTP_PORT,
    auth: {
      user: secrets.SMTP_USER,
      pass: secrets.SMTP_PASS
    }
  };

  var transport = require('nodemailer-smtp-transport');

  return nodemailer.createTransport(transport(transportOptions));
}

module.exports = EmailSender;

var nodemailer = require('nodemailer');
var Q = require('q');
Q.longStackSupport = true;
var secrets = require('../secrets');
