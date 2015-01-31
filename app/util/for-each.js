'use strict';

module.exports = forEach;

function forEach(items) {
  return {
    inSeries: asyncRun('series'),
    inParallel: asyncRun('parallel')
  };

  function asyncRun(flowType) {
    return function(thenableIterator, thisObject) {
      return new Promise(function(resolve, reject) {
        var asyncTasks = prepareAsyncTasks(items, thenableIterator, thisObject);

        async[flowType](asyncTasks, function(err, results) {
          if (err) reject(err);
          else resolve(zip(items, results));
        });
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

var _ = require('underscore');
var async = require('async');
var assert = require('assert');
var Promise = require('app/util/promise');
