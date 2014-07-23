'use strict';

function attachColumns(columns) {
  return function(rows) {
    rows.columns = columns;
    return rows;
  };
}

module.exports = attachColumns;
