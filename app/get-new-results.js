'use strict';

module.exports = getNewResults;

function getNewResults() {
  var levels = [
    DistrictCourts,
    SupremeCourt
  ];

  return time('. getting new results',
    Data.get('/last-ids')
    .then(function(lastRows) {
      return forEach(levels).inSeries(function(level) {
        return forEach(level).inParallel(function(section) {
          return forEach(section.subsectionNames).inParallel(function(subsectionName) {
            return getLastRow(lastRows, level.toString(), section.toString(), subsectionName)
            .then(getLastRowID(section, subsectionName))
            .then(getNewRows(section, subsectionName))
            .then(extractRows);
          })
          .then(addSectionReferences(section));
        });
      });
    })
    .then(removeEmptySearchResults)
    .then(deleteUnusedColumns)
  ).then(reportRowCount);
}

function getLastRow(lastRows, levelLabel, sectionLabel, subsectionName) {
  return new Promise.resolve(
    lastRows
    .filter(where('label', levelLabel)).reduce(noop).results
    .filter(where('label', sectionLabel)).reduce(noop).results
    .filter(where('label', subsectionName)).reduce(noop).results
  );

  // “If the array is empty and no initialValue was provided, TypeError would
  // be thrown. If the array has only one element (regardless of position) and
  // no initialValue was provided, or if initialValue is provided but the array
  // is empty, the solo value would be returned without calling callback.”
  //
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
  function noop() {}
}

function getLastRowID(section, subsectionName) {
  return function(lastRow) {
    return new Promise(function(resolve) {
      var url = section.getURL(subsectionName);

      var form = {
        '_search': true,
        'rows': 1,
        'filters': JSON.stringify({
          'groupOp': 'AND',
          'rules': getRules(lastRow)
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
    })
    .then(extractID);

    function getRules(lastRow) {
      return _(lastRow).map(function(fieldValue, fieldName) {
        return {
          'field': fieldName,
          'op': 'cn',
          'data': fieldValue
        };
      });
    }

    function extractID(result) {
      if (result.rows.length === 0) {
        var context = {
          'lastRow': lastRow,
          'rules': getRules(lastRow),
          'url': section.getURL(subsectionName)
        };

        throw new Error('Couldn’t find the previously saved last row:\n' + JSON.stringify(context));
      }

      return result.rows[0].id;
    }
  };
}

function getNewRows(section, subsectionName) {
  return function(lastID) {
    return new Promise(function(resolve) {
      var url = section.getURL(subsectionName);

      var form = {
        '_search': true,
        'rows': 500,
        'page': 1,
        'filters': JSON.stringify({
          'groupOp': 'AND',
          'rules': [
            {'field': 'id', 'op': 'lt', 'data': lastID}
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
  };
}

function extractRows(result) {
  return result.rows.map(extractData);

  function extractData(row) {
    if (!row.cell) throw new Error('No data found in row: ' + JSON.stringify(row));
    return row.cell;
  }
}

function addSectionReferences(section) {
  return function(results) {
    results.forEach(addReference);
    return results;
  };

  function addReference(result) {
    result.section = section;
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

function reportRowCount(results) {
  var totalNewRowCount = results.reduce(function(rowCount, level) {
    return rowCount + level.results.reduce(function(rowCount, section) {
      return rowCount + section.results.reduce(function(rowCount, subsection) {
        return rowCount + subsection.results.length;
      }, 0);
    }, 0);
  }, 0);

  console.log('.. %s new rows', totalNewRowCount);
  return results;
}

var request = require('request');
var _ = require('underscore');

var normalizeAPIResponse = require('app/util/normalize-api-response');
var sectionColumns = require('app/util/get-useful-section-columns')();
var Data = require('util-data');
var forEach = require('util-for-each');
var Promise = require('app/util/promise');
var time = require('app/util/time');
var where = require('app/util/where');

var SupremeCourt = require('app/supreme-court');
var DistrictCourts = require('app/district-courts');
