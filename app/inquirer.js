'use strict';

var Inquirer = {};

Inquirer.inquireAbout = function(clientNames) {
  var levels = [
    DistrictCourts,
    SupremeCourt
  ];

  return forEach(clientNames).inSeries(function(clientName) {
    return forEach(levels).inSeries(function(sections) {
      return forEach(sections).inParallel(function(section) {
        return inquireSection(section).about(clientName);
      });
    });
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

var SupremeCourt = require('./supreme-court');
var DistrictCourts = require('./district-courts');

var forEach = require('./util/for-each');
var queryAPI = require('./util/query-api');
var attachColumns = require('./util/attach-columns');
var extractRows = require('./util/extract-rows');

module.exports = Inquirer;
