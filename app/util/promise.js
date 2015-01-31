'use strict';

module.exports = Promise;

function Promise(f) {
  return Q.Promise(f);
}

var Q = require('q');
Q.longStackSupport = true;

Promise.all = Q.all;
Promise.reject = Q.reject;
Promise.resolve = Q.resolve;
