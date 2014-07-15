'use strict';

var SENDER_EMAIL = 'info@pinj.pentru.md';

var nodemailer = require('nodemailer');
var async = require('async');
var taskList = require('./task-list');

module.exports = function sendEmails(emails, content) {
  var transport = nodemailer.createTransport('Sendmail');

  var emailSendingTasks = taskList(emails, sendEmail(content, transport));
  async.series(emailSendingTasks, closeTransport(transport));
};


function sendEmail(content, transport) {
  return function taskFactory(email) {
    return function asyncJsTask(callback) {
      transport.sendMail({
        from: SENDER_EMAIL,
        to: email,
        subject: 'PINJ',
        text: 'Please use an email capable of rendering HTML messages',
        html: content
      }, function(err, response) {
        if (err) console.error('err', err, response);

        callback(null, {
          err: err,
          response: response
        });
      });
    };
  };
}

function closeTransport(transport) {
  return function(err, results) {
    transport.close();

    console.log('err', err);
    console.log('results', results);
  };
}
