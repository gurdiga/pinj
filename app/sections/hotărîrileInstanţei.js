'use strict';

var SECTION_ID = 'hotărîrileInstanţei';

var format = require('util').format;

var clone = require('../clone');
var courts = require('../meta').courts;
var sections = require('../meta').sections;
var querySection = require('../query-section');

module.exports.query = function(query) {
  courts = clone(courts);

  // pare să nu fie implementată pentru Slobozia
  // http://instante.justice.md/cms/curtea-de-apel-bender/jslb-menu
  delete courts.jslb;

  return querySection(SECTION_ID, query, courts);
};

module.exports.preprocess = function(row, query, sectionId, courtId) {
  var pdfUrlFormat = 'http://instante.justice.md/apps/hotariri_judecata/inst/%s/%s';
  var pdfLink = row.cell[0];
  var hrefRegExp = /a href="([^"]+)"/;

  if (hrefRegExp.test(pdfLink)) {
    var relativePdfUrl = pdfLink.match(hrefRegExp)[1];
    var fullPdfUrl = format(pdfUrlFormat, courtId, relativePdfUrl);
    row.cell[101] = fullPdfUrl;
  }
};

module.exports.getSearchOptions = function(query) {
  var searchOptions = clone(sections[SECTION_ID].searchOptions);
  var currentYear = (new Date()).getFullYear();

  searchOptions.filters = JSON.stringify(searchOptions.filters)
    .replace(/%QUERY%/g, query)
    .replace(/%CURRENT_YEAR%/g, currentYear);

  return searchOptions;
};

module.exports.getUrl = function(courtId) {
  return format(sections[SECTION_ID].urlFormat, courtId);
};
