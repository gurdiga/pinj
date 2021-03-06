'use strict';

module.exports = prepareEmailBodies;

function prepareEmailBodies(news) {
  var bodies = {
    html: formatAsHTML(news),
    text: JSON.stringify(news)
  };

  return bodies;
}

function formatAsHTML(news) {
  var displayableColumns = getUsefulSectionColumns(function(column) {
    return column.show;
  });

  var templateContext = {
    'news': news,
    'sectionColumns': displayableColumns,
    'courts': Courts,
    'MAX_ROWS_PER_SECTION': 20,
    'pretty': true,
    'css': prepareCSS()
  };

  var templateCode = fs.readFileSync(__dirname + '/email-templates/search-results-template.html._', {encoding: 'utf8'});
  var html = _.template(templateCode)(templateContext);

  return html;
}

function prepareCSS() {
  var json = require('app/email-templates/search-results-template.css');

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

var getUsefulSectionColumns = require('app/util/get-useful-section-columns');
var Courts = require('app/district-courts/courts');
var _ = require('underscore');
var fs = require('fs');
