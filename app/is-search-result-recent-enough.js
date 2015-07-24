'use strict';

var MONTH = 31 * 24 * 3600 * 1000;
var MAX_AGE = 3 * MONTH;

function isSearchResultRecentEnough(section, row) {
  var rowDate = section.getRowDate(row);
  var currentDate = new Date();

  return currentDate - rowDate <= MAX_AGE;
}

module.exports = isSearchResultRecentEnough;
