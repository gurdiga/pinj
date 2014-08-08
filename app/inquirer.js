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
        return section.inquireAbout(clientName);
      });
    });
  });
};

var forEach = require('./util/for-each');
var DistrictCourts = require('./district-courts');
var SupremeCourt = require('./supreme-court');

module.exports = Inquirer;
