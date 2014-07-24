'use strict';

var Emailer = {};

Emailer.send = function(results, address) {
  var deferred = Q.defer();
  var html = formatAsHTML(results);

  transport.sendMail({
    from: 'info@pinj.pentru.md',
    to: address,
    subject: 'Informaţii PINJ',
    text: 'Please use an email program capable of rendering HTML messages',
    html: html
  }, function(err) {
    if (err) deferred.reject(err);
    else deferred.resolve();
  });

  return deferred.promise;
};

function formatAsHTML(results) {
  var templateContext = {
    'results': results,
    'MAX_ROWS_PER_SECTION': 20,
    'pretty': true,
    'css': prepareCSS()
  };

  return jade.renderFile(__dirname + '/email-template.html.jade', templateContext);
}

function prepareCSS() {
  var json = require('./email-template.css');

  return _.chain(json)
    .map(function(properties, selector) {
      properties = _(properties).map(function(value, name) {
        return name + ':' + value;
      });

      return [selector, properties.join(';')];
    })
    .object()
    .value();
}

module.exports = Emailer;

var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport(require('nodemailer-smtp-transport')({}));
var Q = require('q');
var _ = require('underscore');
var jade = require('jade');
