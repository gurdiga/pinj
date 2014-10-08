'use strict';

var Inquirer = {};

Inquirer.inquireAbout = function(clientNames) {
  var levels = [
    DistrictCourts,
    SupremeCourt
  ];

  return forEach(clientNames).inSeries(function(clientName) {
    var timingLabel = '- ' + clientName;

    return time(forEach(levels).inSeries(function(sections) {
      return forEach(sections).inParallel(function(section) {
        return inquireSection(section).about(clientName);
      });
    }), timingLabel);
  });
};

function inquireSection(section) {
  return {
    'about': function(clientName) {
      return forEach(section.subsectionNames).inParallel(function(subsectionName) {
        return queryAPI(section.getAPIRequestParams(subsectionName, clientName))
          .then(extractRows(section.rowPreprocessor, subsectionName));
      })
      .then(attachColumns(section.columns));
    }
  };
}

function extractRows(rowPreprocessor, subsectionName) {
  rowPreprocessor = rowPreprocessor || function noop(row) { return row; };

  return function(result) {
    return result.rows.map(function(row) {
      return rowPreprocessor(row.cell, row.id, subsectionName);
    });
  };
}

function attachColumns(columns) {
  return function(rows) {
    rows.columns = columns;
    return rows;
  };
}

var SupremeCourt = require('./supreme-court');
var DistrictCourts = require('./district-courts');

var time = require('./util/time');
var forEach = require('./util/for-each');
var queryAPI = require('./util/query-api');

module.exports = Inquirer;
