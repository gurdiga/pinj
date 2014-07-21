'use strict';

var _ = require('underscore');

function getRows(results) {
  var rows = [];

  _(results).each(function(result) {
    if (result && result.rows) rows = rows.concat(result.rows);
  });

  return rows;
}

module.exports = getRows;
