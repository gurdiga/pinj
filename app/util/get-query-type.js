'use strict';

module.exports = queryType;

var CASE_NUMBER_FORMAT = /^#.+/;

function queryType(query) {
  if (CASE_NUMBER_FORMAT.test(query)) return 'caseNumber';
  else return 'name';
}
