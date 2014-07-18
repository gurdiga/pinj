'use strict';

var SENDER_EMAIL = 'info@pinj.pentru.md';

var nodemailer = require('nodemailer');
var transportInit = require('nodemailer-smtp-transport');

module.exports = function sendEmail(email, content) {
  var transportOptions = {
  };
  var transport = nodemailer.createTransport(transportInit(transportOptions));

  transport.sendMail({
    from: SENDER_EMAIL,
    to: email,
    subject: 'PINJ',
    text: 'Please use an email program capable of rendering HTML messages',
    html: content
  }, function(err, response) {
    if (err) {
      console.error('err', err, response);
    } else {
      console.log('sent to', email, content.length);
    }

    transport.close();
  });
};
