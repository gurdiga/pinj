'use strict';

module.exports = getNewRows;

function getNewRows() {
  var levels = [
    DistrictCourts,
    SupremeCourt
  ];

  return Data.get('/last-ids').then(function(lastIDs) {
    return forEach(levels).inSeries(function(level) {
      return forEach(level).inParallel(function(section) {
        return forEach(section.subsectionNames).inParallel(function(subsectionName) {
          var lastID = getLastID(lastIDs, level.toString(), section.toString(), subsectionName);
          return getRows(section, subsectionName, lastID)
          .then(extractRows);
        });
      });
    });
  })
  .then(removeEmptySearchResults)
  .then(deleteUnusedColumns);
}

function getLastID(lastIDs, levelLabel, sectionLabel, subsectionName) {
  return lastIDs
  .filter(havingLabel(levelLabel)).reduce(noop).results
  .filter(havingLabel(sectionLabel)).reduce(noop).results
  .filter(havingLabel(subsectionName)).reduce(noop).results;

  function havingLabel(label) {
    return function(item) {
      return item.label === label;
    };
  }

  // “If the array is empty and no initialValue was provided, TypeError would
  // be thrown. If the array has only one element (regardless of position) and
  // no initialValue was provided, or if initialValue is provided but the array
  // is empty, the solo value would be returned without calling callback.”
  //
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
  function noop() {}
}

function getRows(section, subsectionName, lastID) {
  return new Promise(function(resolve) {
    var url = section.getURL(subsectionName);

    var form = {
      '_search': true,
      'nd': Date.now(),
      'rows': 500,
      'page': 1,
      'filters': JSON.stringify({
        'groupOp': 'AND',
        'rules': [
          {'field': 'id', 'op': 'gt', 'data': lastID}
        ]
      })
    };

    var requestOptions = {
      uri: url,
      form: form,
      method: 'POST',
      gzip: true,
      json: true
    };

    request(requestOptions, normalizeAPIResponse(url, form, resolve));
  });
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
    return row.cell;
  }
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
  results.forEach(function(level) {
    level.results.forEach(function(section) {
      section.results.forEach(function(court) {
        court.results.forEach(deleteUnusedCells(section));
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

var request = require('request');
var _ = require('underscore');

var normalizeAPIResponse = require('app/util/normalize-api-response');
var sectionColumns = require('app/util/get-useful-section-columns')();
var Data = require('app/util/data');
var forEach = require('app/util/for-each');
var Promise = require('app/util/promise');

var SupremeCourt = require('app/supreme-court');
var DistrictCourts = require('app/district-courts');
