'use strict';

var EmailFormatter = {};

EmailFormatter.formatAsHTML = function(results) {
  var templateContext = {
    'results': results,
    'MAX_ROWS_PER_SECTION': 20,
    'pretty': true,
    'css': prepareCSS()
  };

  return jade.renderFile(__dirname + '/template.html.jade', templateContext);
};

function prepareCSS() {
  var json = require('./template.css');

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

module.exports = EmailFormatter;

var _ = require('underscore');
var jade = require('jade');
