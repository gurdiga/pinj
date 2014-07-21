'use strict';

var _ = require('underscore');
var async = require('async');

var queryApi = require('./query-api');
var taskList = require('./task-list');
var courts = require('./meta').courts;

module.exports = function querySection(sectionId, query, courts) {
  var courtsIds = _(courts).keys();

  return function(callback) {
    var apiQueries = taskList(courtsIds, prepareApiQuery(sectionId, query));
    async.series(apiQueries, passResultsTo(callback, sectionId, query));
  };
};


function prepareApiQuery(sectionId, query) {
  return function queryCourt(courtId) {
    return function(callback) {
      var section = require('./sections/' + sectionId);
      var searchOptions = section.getSearchOptions(query);
      var url = section.getUrl(courtId);

      queryApi(url, searchOptions, function(err, result) {
        preprocess(result, query, sectionId, courtId);
        return callback(err, result);
      });

      function preprocess(result, query, sectionId, courtId) {
        _(result.rows).each(function(row) {
          section.preprocess(row, query, sectionId, courtId);
        });
      }
    };
  };
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
          errors.push(courts[id]);
        }
      });
    }

    callback(null, {
      rows: rows,
      errors: errors
    });
  };
}
