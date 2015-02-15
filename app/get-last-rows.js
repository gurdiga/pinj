'use strict';

module.exports = getLastRows;

function getLastRows() {
  var levels = [
    DistrictCourts,
    SupremeCourt
  ];

  return forEach(levels).inSeries(function(sections) {
    return forEach(sections).inParallel(function(section) {
      return forEach(section.subsectionNames).inParallel(function(subsectionName) {
        return getLastRow(section, subsectionName).then(function(data) {
          return section.columns
          .filter(publishedColumns)
          .reduce(columnValue(data.rows[0].cell), {});
        });
      });
    });
  });

  function publishedColumns(column) {
    return ('tableColumnName' in column) && (['data_inregistrare', 'data_actualizare', 'data_publicare', 'PDF'].indexOf(column.tableColumnName) === -1);
  }

  function columnValue(row) {
    return function(values, column) {
      if (!column.tableColumnName) throw new Error('There is no tableColumnName defined for column: ' + JSON.stringify(column));

      var value = row[column.index].trim();
      if (value) values[column.tableColumnName] = value;

      return values;
    };
  }
}

function getLastRow(section, subsectionName) {
  return new Promise(function(resolve) {
    var url = section.getURL(subsectionName);

    var form = {
      'rows': 1,
      'page': 1,
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

var request = require('request');

var normalizeAPIResponse = require('app/util/normalize-api-response');
var forEach = require('util-for-each');
var Promise = require('app/util/promise');

var SupremeCourt = require('app/supreme-court');
var DistrictCourts = require('app/district-courts');
