'use strict';

module.exports = function timedTask(f, label) {
  return function(callback) {
    console.time(label);
    return f(function(err, results) {
      console.timeEnd(label);
      return callback(err, results);
    });
  };
};
