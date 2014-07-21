'use strict';

var SECTION_ID = 'agendaŞedinţelor';

var format = require('util').format;

var clone = require('../clone');
var meta = require('../meta');
var querySection = require('../query-section');

module.exports.query = function(query) {
  var courts = clone(meta.courts);

  // pare să nu fie implementată pentru Slobozia
  // http://instante.justice.md/cms/curtea-de-apel-bender/jslb-menu
  delete courts.jslb;

  return querySection(SECTION_ID, query, courts);
};

module.exports.preprocess = function(row, query, sectionId, courtId) {
  var courtName = meta.courts[courtId];
  row.cell[100] = courtName;
};

module.exports.getSearchOptions = function(query) {
  var searchOptions = clone(meta.sections[SECTION_ID].searchOptions);
  var currentYear = (new Date()).getFullYear();

  searchOptions.filters = JSON.stringify(searchOptions.filters)
    .replace(/%QUERY%/g, query)
    .replace(/%CURRENT_YEAR%/g, currentYear);

  return searchOptions;
};

module.exports.getUrl = function(courtId) {
  return format(meta.sections[SECTION_ID].urlFormat, courtId);
};
