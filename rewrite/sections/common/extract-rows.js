'use strict';

function extractRows(results) {
  if (singleResult(results)) return extractRowsFromOneResult(results);
  else return extractRowsFromMultipleResults(results);
}

function singleResult(result) {
  return ('total' in result);
}

function extractRowsFromOneResult(result) {
  if (result && result.rows) return result.rows;
  else return [];
}

function extractRowsFromMultipleResults(results) {
  var _ = require('underscore');

  return _(results).reduce(function(rows, result) {
    return rows.concat(extractRowsFromOneResult(result));
  }, []);
}

module.exports = extractRows;

(function inlineTest() {
  var assert = require('assert');

  var multipleResults = {
    'someKey1': {rows: [1, 2, 3]},
    'someKey2': {rows: [4, 5, 6]},
    'someKey3': {rows: [7, 8, 9]},
    'someKey4': {rows: [10, 11, 12]}
  };

  assert.deepEqual(
    extractRowsFromMultipleResults(multipleResults),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  );
}());
