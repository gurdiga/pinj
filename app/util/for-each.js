'use strict';

function forEach(items) {
  return {
    inSeries: asyncRun('series'),
    inParallel: asyncRun('parallel')
  };

  function asyncRun(flowType) {
    return function(thenableIterator, thisObject) {
      return Q.Promise(function(resolve, reject) {
        var asyncTasks = prepareAsyncTasks(items, thenableIterator, thisObject);

        if (flowType === 'parallel') {
          async.parallelLimit(asyncTasks, 10, callback);
        } else {
          async.series(asyncTasks, callback);
        }

        function callback(err, results) {
          if (err) reject(err);
          else resolve(zip(items, results));
        }
      });
    };
  }

  function prepareAsyncTasks(items, thenableIterator, thisObject) {
    return _.chain(items)
      .map(function(item) {
        return [item, function(callback) {
          var promise = thenableIterator.call(thisObject, item);

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

module.exports = forEach;

var _ = require('underscore');
var async = require('async');
var Q = require('q');
Q.longStackSupport = true;
var assert = require('assert');
