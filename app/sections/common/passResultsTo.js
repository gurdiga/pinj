'use strict';

var _ = require('underscore');
var instanţe = require('../../meta').instanţe;

module.exports = function passResultsTo(callback, sectionName, query) {
  return function(err, results) {
    var rows = [];
    var errors = [];

    if (err) {
      console.error(sectionName, query, err);
    } else {
      _(results).each(function(result, id) {
        if (_(result).isObject()) {
          if (result.rows) rows = rows.concat(result.rows);
        } else {
          console.error(id, result);
          errors.push(instanţe[id]);
        }
      });
    }

    callback(null, {
      rows: rows,
      errors: errors
    });
  };
};
