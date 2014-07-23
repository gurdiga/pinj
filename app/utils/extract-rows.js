'use strict';

function extractRows(augmentEachRow) {
  augmentEachRow = augmentEachRow || function noop(row) { return row; };

  return function(result) {
    return result.rows.map(function(row) {
      row = row.cell;
      return augmentEachRow(row);
    });
  };
}

module.exports = extractRows;
