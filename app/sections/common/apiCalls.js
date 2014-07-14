'use strict';

var format = require('util').format;
var _ = require('underscore');
var serialize = require('async').series;
var strings = require('../../strings');
var queryApi = require('../../query-api');
var passResultsTo = require('./passResultsTo');

module.exports = function apiCalls(sectionId, query, instanţe) {
  var urlFormat = strings[sectionId].urlFormat;
  var searchOptions = prepareSearchOptions(sectionId, query);

  var calls = _.chain(instanţe)
    .map(function(denumire, id) {
      return [id, function(callback) {
        var url = format(urlFormat, id);
        queryApi(url, searchOptions, callback);
      }];
    })
    .object()
    .value();

  return function(callback) {
    serialize(calls, passResultsTo(callback, sectionId, query));
  };
};


function prepareSearchOptions(sectionId, query) {
  var searchOptions = strings[sectionId].searchOptions;

  searchOptions.filters = JSON.stringify(searchOptions.filters).replace(/%QUERY%/g, query);

  return searchOptions;
}
