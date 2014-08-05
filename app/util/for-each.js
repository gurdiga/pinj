'use strict';

function forEach(items) {
  return {
    inSeries: asyncRun('series'),
    inParallel: asyncRun('parallel')
  };

  function asyncRun(flowType) {
    return function(thenable, thisObject) {
      var asyncTasks = prepareAsyncTasks(items, thenable, thisObject);
      var deferred = Q.defer();

      async[flowType](asyncTasks, function(err, results) {
        if (err) deferred.reject(err);
        else deferred.resolve(zip(items, results));
      });

      return deferred.promise;
    };
  }

  function prepareAsyncTasks(items, thenable, thisObject) {
    return _.chain(items)
      .map(function(item) {
        return [item, timedTask(function(callback) {
          var promise = thenable.call(thisObject, item);

          assert(typeof promise === 'object', 'A thenable should return a promise object.');
          assert('then' in promise, 'A promise must have the “then” method.');

          promise
          .then(function(result) {
            callback(null, result);
          })
          .catch(callback);
        }, item.toString())];
      })
      .object()
      .value();
  }

  function zip(items, results) {
    return items.map(function(item) {
      var label = item.toString();

      return {
        'label': label,
        'results': results[label]
      };
    });
  }
}

function timedTask(f, label) {
  return function(callback) {
    console.time(label);
    return f(function(err, results) {
      console.timeEnd(label);
      return callback(err, results);
    });
  };
}

module.exports = forEach;

var _ = require('underscore');
var async = require('async');
var Q = require('q');
Q.longStackSupport = true;
var assert = require('assert');
