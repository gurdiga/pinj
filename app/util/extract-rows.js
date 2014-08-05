'use strict';

function extractRows(augmentEachRow) {
  augmentEachRow = augmentEachRow || function noop(row) { return row; };

  return function(result) {
    return result.rows.map(function(row) {
      var id = row.id;
      row = row.cell;
      return augmentEachRow(row, id);
    });
  };
}

module.exports = extractRows;
