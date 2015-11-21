'use strict';

module.exports = getCurrentSearchResults;

var DELAY_AFTER_EACH_CLIENT = process.env.DELAY_AFTER_EACH_CLIENT || 3000;

function getCurrentSearchResults(clientList) {
  return function() {
    var levels = [
      DistrictCourts,
      SupremeCourt
    ];

    return forEach(clientList).inSeries(function(clientName) {
      return time(forEach(levels).inSeries(function(sections) {
        return forEach(sections).inSeries(function(section) {
          return forEach(section.subsectionNames).inParallel(function(subsectionName) {
            var apiRequestParams = section.getAPIRequestParams(subsectionName, escapeQuotes(clientName));

            return queryAPI(apiRequestParams)
            .then(extractRows(section))
            .then(preprocessRows(section.rowPreprocessor));
          })
          .then(delay(1000));
        })
        .then(delay(1000));
      })
      .then(delay(DELAY_AFTER_EACH_CLIENT)), '- ' + clientName);
    })
    .then(removeEmptySearchResults)
    .then(deleteUnusedColumns)
    .then(stringifyRows);
  };
}

function extractRows(section) {
  return function(result) {
    return result.rows
    .filter(withValidID)
    .filter(withValidData)
    .filter(relevant)
    .map(extractData);
  };

  function withValidID(row) {
    return !!row.id;
  }

  function withValidData(row) {
    return !!row.cell;
  }

  function relevant(row) {
    return isSearchResultRecentEnough(section, row.cell);
  }

  function extractData(row) {
    var rowData = row.cell;
    rowData.push(row.id);
    return rowData;
  }
}

function preprocessRows(rowPreprocessor) {
  return function(rows) {
    if (!rowPreprocessor) return rows;
    else return rows.map(rowPreprocessor);
  };
}

function removeEmptySearchResults(items) {
  var emptyItemIndexes = [];

  items.forEach(function(item, i) {
    if (!('results' in item)) return;
    if (item.results.length > 0) removeEmptySearchResults(item.results);
    if (item.results.length === 0) emptyItemIndexes.push(i);
  });

  emptyItemIndexes.reverse().forEach(function(i) {
    items.splice(i, 1);
  });

  return items;
}

function deleteUnusedColumns(results) {
  results.forEach(function(client) {
    client.results.forEach(function(level) {
      level.results.forEach(function(section) {
        section.results.forEach(function(court) {
          court.results.forEach(deleteUnusedCells(section));
        });
      });
    });
  });

  return results;
}

function deleteUnusedCells(section) {
  var usedColumns = getUsedColumnIndexes(sectionColumns[section.label]);

  return function(row) {
    _.chain(row)
      .omit(usedColumns)
      .each(function(v, i) {
        delete row[i];
      });
  };
}

function getUsedColumnIndexes(columns) {
  return columns
    .filter(function(column) {
      return 'index' in column;
    })
    .map(function(column) {
      return column.index.toString();
    });
}

function stringifyRows(results) {
  results.forEach(function(client) {
    client.results.forEach(function(level) {
      level.results.forEach(function(section) {
        section.results.forEach(function(court) {
          court.results = court.results.map(JSON.stringify);
        });
      });
    });
  });

  return results;
}

function delay(ms) {
  return function(v) {
    return Q.delay(ms)
    .then(function() { return v; });
  };
}

var SupremeCourt = require('app/supreme-court');
var DistrictCourts = require('app/district-courts');
var isSearchResultRecentEnough = require('app/is-search-result-recent-enough');
var forEach = require('app/util/for-each');
var queryAPI = require('app/util/query-api');
var escapeQuotes = require('app/util/mysql-escape');
var time = require('app/util/time');
var sectionColumns = require('app/util/get-useful-section-columns')();
var _ = require('underscore');
var Q = require('q');
