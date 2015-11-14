'use strict';

var PAGE_SIZE = 500;

module.exports = function(pageNumber) {
  assert(typeof pageNumber === 'number', 'pageNumber is expected to be a number');
  assert(pageNumber > 0, 'pageNumber is expected to be > 0');

  return {
    '_search': false,
    'rows': PAGE_SIZE,
    'page': pageNumber
  };
};

module.exports.PAGE_SIZE = PAGE_SIZE;

var assert = require('assert');
