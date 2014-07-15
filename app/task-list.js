'use strict';

var _ = require('underscore');
var timedTask = require('./timed-task');

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
