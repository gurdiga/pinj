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
        else deferred.resolve(results);
      });

      return deferred.promise;
    };
  }

  function prepareAsyncTasks(items, thenable, thisObject) {
    return _.chain(items)
      .map(function(item) {
        return [item, function(callback) {
          var promise = thenable.call(thisObject, item);

          assert(typeof promise === 'object', 'A thenable should return a promise object.');
          assert('then' in promise, 'A promise must have the “then” method.');

          promise
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

var _ = require('underscore');
var async = require('async');
var Q = require('q');
Q.longStackSupport = true;
var assert = require('assert');

