'use strict';

var _ = require('underscore');

module.exports = function taskList(taskLabels, taskFactory) {
  return _.chain(taskLabels)
    .map(function(taskLabel) {
      var taskInput = taskLabel;
      var task = taskFactory(taskInput);

      var timingLabel = taskLabel;
      task = timedTask(task, timingLabel);

      return [taskLabel, task];
    })
    .object()
    .value();
};


function timedTask(f, label) {
  return function(callback) {
    console.time(label);
    return f(function(err, results) {
      console.timeEnd(label);
      return callback(err, results);
    });
  };
}
