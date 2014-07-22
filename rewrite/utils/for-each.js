'use strict';

var _ = require('underscore');
var async = require('async');
var Q = require('q');

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
        else deferred.resolve(results);
      });

      return deferred.promise;
    };
  }

  function prepareAsyncTasks(items, thenable, thisObject) {
    return _.chain(items)
      .map(function(item) {
        return [item, function(callback) {
          thenable.call(thisObject, item)
          .then(function(result) {
            callback(null, result);
          })
          .catch(callback);
        }];
      })
      .object()
      .value();
  }
}

module.exports = forEach;
