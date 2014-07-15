'use strict';

module.exports = function clone(object) {
  return JSON.parse(JSON.stringify(object));
};
