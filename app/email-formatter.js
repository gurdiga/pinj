'use strict';

var EmailFormatter = {};

EmailFormatter.formatAsHTML = function formatAsHTML(results) {
  var templateContext = {
    'results': results,
    'MAX_ROWS_PER_SECTION': 20,
    'pretty': true,
    'css': prepareCSS()
  };

  var templateCode = fs.readFileSync(__dirname + '/email/template.html._', {encoding: 'utf8'});
  return _.template(templateCode, templateContext);
};

function prepareCSS() {
  var json = require('./email/template.css');

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
var fs = require('fs');
