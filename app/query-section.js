'use strict';

var format = require('util').format;
var _ = require('underscore');
var async = require('async');

var sections = require('./meta').sections;

var clone = require('./clone');
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
      var searchOptions = prepareSearchOptions(sectionId, query);
      var url = format(sections[sectionId].urlFormat, courtId);

      queryApi(url, searchOptions, function(err, result) {
        preprocess(result, sectionId, courtId);
        return callback(err, result);
      });
    };
  };
}

function preprocess(result, sectionId, courtId) {
  var operationsPerSection = {
    'cereriÎnInstanţă': function() {
    },
    'agendaŞedinţelor': function(row, sectionId, courtId) {
      var courtName = courts[courtId];
      row.cell[100] = courtName;
    },
    'hotărîrileInstanţei': function(row, sectionId, courtId) {
      var pdfUrlFormat = 'http://instante.justice.md/apps/hotariri_judecata/inst/%s/%s';
      var pdfLink = row.cell[0];
      var hrefRegExp = /a href="([^"]+)"/;

      if (hrefRegExp.test(pdfLink)) {
        var relativePdfUrl = pdfLink.match(hrefRegExp)[1];
        var fullPdfUrl = format(pdfUrlFormat, courtId, relativePdfUrl);
        row.cell[101] = fullPdfUrl;
      }
    },
    'citaţiiÎnInstanţă': function() {
    }
  };

  _(result.rows).each(function(row) {
    operationsPerSection[sectionId](row, sectionId, courtId);
  });
}

function prepareSearchOptions(sectionId, query) {
  var searchOptions = clone(sections[sectionId].searchOptions);

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
