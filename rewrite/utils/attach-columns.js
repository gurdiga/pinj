'use strict';

function attachColumns(Section) {
  return function(rows) {
    rows.columns = Section.columns;
    return rows;
  };
}

module.exports = attachColumns;
