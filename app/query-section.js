'use strict';

var format = require('util').format;
var _ = require('underscore');
var async = require('async');
var sections = require('./meta').sections;
var instanţe = require('./meta').instanţe;
var queryApi = require('./query-api');

module.exports = function querySection(sectionId, query, instanţe) {
  var urlFormat = sections[sectionId].urlFormat;
  var searchOptions = prepareSearchOptions(sectionId, query);

  var apiQueries = _.chain(instanţe)
    .map(function(denumire, id) {
      return [id, function(callback) {
        var url = format(urlFormat, id);
        queryApi(url, searchOptions, callback);
      }];
    })
    .object()
    .value();

  return function(callback) {
    async.series(apiQueries, passResultsTo(callback, sectionId, query));
  };
};


function prepareSearchOptions(sectionId, query) {
  var searchOptions = sections[sectionId].searchOptions;

  searchOptions.filters = JSON.stringify(searchOptions.filters).replace(/%QUERY%/g, query);

  return searchOptions;
}

function passResultsTo(callback, sectionId, query) {
  return function(err, results) {
    var rows = [];
    var errors = [];

    if (err) {
      console.error(sectionId, query, err);
    } else {
      _(results).each(function(result, id) {
        if (_(result).isObject()) {
          if (result.rows) rows = rows.concat(result.rows);
        } else {
          console.error(id, result);
          errors.push(instanţe[id]);
        }
      });
    }

    callback(null, {
      rows: rows,
      errors: errors
    });
  };
}
