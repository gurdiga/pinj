'use strict';

module.exports = getUsefulSectionColumns;

function getUsefulSectionColumns(customFilter) {
  customFilter = customFilter || function noop() { return true; };

  var columns = {};
  var levels = [
    DistrictCourts,
    SupremeCourt
  ];

  levels.forEach(function(sections) {
    sections.forEach(function(section) {
      columns[section] = section.columns
      .filter(customFilter)
      .filter(function(column) {
        return column.show || column.used;
      });
    });
  });

  return columns;
}

var SupremeCourt = require('app/supreme-court');
var DistrictCourts = require('app/district-courts');
