'use strict';

function flattenResults(results) {
  var reduce = require('underscore').reduce;

  return reduce(results, function(allRows, theseRows) {
    return allRows.concat(theseRows);
  }, []);
}

module.exports = flattenResults;
