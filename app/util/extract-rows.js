'use strict';

function extractRows(rowPreprocessor, subsectionName) {
  rowPreprocessor = rowPreprocessor || function noop(row) { return row; };

  return function(result) {
    return result.rows.map(function(row) {
      return rowPreprocessor(row.cell, row.id, subsectionName);
    });
  };
}

module.exports = extractRows;
