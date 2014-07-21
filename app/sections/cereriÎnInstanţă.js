'use strict';

var SECTION_ID = 'cereriÎnInstanţă';

var format = require('util').format;

var clone = require('../clone');
var sections = require('../meta').sections;
var querySection = require('../query-section');

module.exports.query = function(query) {
  var courts = {'url-unic': 'Cereri în instanţă'};

  return querySection(SECTION_ID, query, courts);
};

module.exports.preprocess = function() {
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
