'use strict';

var jade = require('jade');
var strings = require('./strings.json');
var _ = require('underscore');

module.exports = function(data) {
  _(data.results).each(function(result, id) {
    try {
      data.results[id] = JSON.parse(result);
    } catch(e) {
      data.results[id] = { error: result };
    }
  });

  var jadeOptions = { pretty: true};

  _(data).extend(jadeOptions);
  data.strings = strings;

  return jade.renderFile('app/template.html.jade', data);
};
