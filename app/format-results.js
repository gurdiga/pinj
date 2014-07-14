'use strict';

var jade = require('jade');
var meta = require('./meta.json');
var _ = require('underscore');

module.exports = function(data) {
  var jadeOptions = { pretty: true};

  _(data).extend(jadeOptions);
  data.sections = meta.sections;

  return jade.renderFile('app/template.html.jade', data);
};
