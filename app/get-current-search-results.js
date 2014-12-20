'use strict';

module.exports = getCurrentSearchResults;

function getCurrentSearchResults(clientList) {
  var levels = [
    DistrictCourts,
    SupremeCourt
  ];

  return forEach(clientList).inSeries(function(clientName) {
    return time(forEach(levels).inSeries(function(sections) {
      return forEach(sections).inParallel(function(section) {
        return forEach(section.subsectionNames).inParallel(function(subsectionName) {
          var apiRequestParams = section.getAPIRequestParams(subsectionName, escapeQuotes(clientName));

          return queryAPI(apiRequestParams)
          .then(extractRows);
        });
      });
    }), '- ' + clientName);
  })
  .then(removeEmptySearchResults)
  .then(deleteUnusedColumns)
  .then(stringifyRows);
}

function extractRows(result) {
  return result.rows
  .filter(withValidID)
  .filter(withValidData)
  .map(extractData);

  function withValidID(row) {
    return !!row.id;
  }

  function withValidData(row) {
    return !!row.cell;
  }

  function extractData(row) {
    var rowData = row.cell;
    rowData.push(row.id);
    return rowData;
  }
}

function removeEmptySearchResults(items) {
  var emptyItems = [];

  items.forEach(function(item, i) {
    if (!('results' in item)) return;
    if (item.results.length > 0) removeEmptySearchResults(item.results);
    if (item.results.length === 0) emptyItems.push(i);
  });

  emptyItems.reverse().forEach(function(i) {
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
  var sectionColumns = getSectionColumns();
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

var SupremeCourt = require('app/supreme-court');
var DistrictCourts = require('app/district-courts');
var forEach = require('app/util/for-each');
var queryAPI = require('app/util/query-api');
var escapeQuotes = require('app/util/mysql-escape');
var time = require('app/util/time');
var getSectionColumns = require('app/util/get-section-columns');
var _ = require('underscore');
