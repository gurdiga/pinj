'use strict';

var Q = require('q');
Q.longStackSupport = true;

module.exports = Promise;

function Promise(f) {
  return Q.Promise(f);
}

Promise.all = Q.all;
Promise.reject = Q.reject;
Promise.resolve = Q.resolve;
