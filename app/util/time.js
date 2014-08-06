'use strict';

function time(f, label) {
  label = label || f.name;

  return function() {
    console.time(label);
    var returnValue = f.apply(this, arguments);
    console.timeEnd(label);

    return returnValue;
  };
}

module.exports = time;

(function selfTest() {
  var assert = require('assert');

  function add(a, b) {
    return a + b;
  }

  assert.equal(time(add)(1, 2), 3);
}());
