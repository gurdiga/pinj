'use strict';

module.exports = function moduleName(module) {
  return module.filename.match(/([^\/]+).js$/)[1];
};
