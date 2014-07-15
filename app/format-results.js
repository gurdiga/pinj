'use strict';

var jade = require('jade');
var meta = require('./meta.json');
var templateCss = require('./template.css');
var _ = require('underscore');

module.exports = function formatResults(data) {
  var jadeOptions = { pretty: true};

  _(data).extend(jadeOptions);

  data.sections = meta.sections;
  data.css = prepareCSS(templateCss);

  return jade.renderFile('app/template.html.jade', data);
};


function prepareCSS(json) {
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
