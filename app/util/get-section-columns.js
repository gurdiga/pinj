'use strict';

module.exports = getSectionColumns;

function getSectionColumns(filter) {
  filter = filter || function noop() { return true; };

  var columns = {};
  var levels = [
    DistrictCourts,
    SupremeCourt
  ];

  levels.forEach(function(sections) {
    sections.forEach(function(section) {
      columns[section.toString()] = section.columns
      .filter(filter)
      .filter(function(column) {
        return column.show || column.used;
      });
    });
  });

  return columns;
}

var SupremeCourt = require('app/supreme-court');
var DistrictCourts = require('app/district-courts');
