'use strict';

module.exports = sendEmail;

function sendEmail(email, subject) {
  return function(bodies) {
    return new Promise(function(resolve, reject) {
      if (process.env.NODE_ENV === 'development' && email !== 'gurdiga@gmail.com') return;

      var transport = getTransport();
      var emailOptions = {
        to: email,
        html: bodies.html,
        text: bodies.text,
        from: 'info@pinj.pentru.md',
        subject: subject
      };

      transport.sendMail(emailOptions, function(error) {
        if (error) reject(error);
        else resolve();
      });
    });
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

var Promise = require('app/util/promise');
var nodemailer = require('nodemailer');
