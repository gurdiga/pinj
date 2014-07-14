'use strict';

var jade = require('jade');
var strings = require('./strings.json');
var _ = require('underscore');

module.exports = function(data) {
  var jadeOptions = { pretty: true};

  _(data).extend(jadeOptions);
  data.strings = strings;

  return jade.renderFile('app/template.html.jade', data);
};
