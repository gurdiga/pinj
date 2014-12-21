'use strict';

module.exports = sendEmail;

function sendEmail(email, subject) {
  return function(bodies) {
    if (process.env.NODE_ENV === 'import') return;
    if (process.env.NODE_ENV === 'development' && email !== 'gurdiga@gmail.com') return;

    var transport = getTransport();
    var emailOptions = {
      to: email,
      html: bodies.html,
      text: bodies.text,
      from: 'info@pinj.pentru.md',
      subject: subject
    };

    var action = Q.ninvoke(transport, 'sendMail', emailOptions);
    return time(action, '. sending email: ' + subject);
  };
}

function getTransport() {
  var transportOptions = {
    'host': process.env.SMTP_HOST,
    'port': process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };

  var transport = require('nodemailer-smtp-transport');

  return nodemailer.createTransport(transport(transportOptions));
}

var nodemailer = require('nodemailer');
var Q = require('q');
Q.longStackSupport = true;
var time = require('app/util/time');
