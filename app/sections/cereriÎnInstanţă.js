'use strict';

var apiCalls = require('./common/apiCalls');
var moduleName = require('./common/moduleName');

module.exports = function cereriÎnInstanţă(query) {
  var sectionName = moduleName(module);
  var instanţe = {'url-unic': 'Cereri în instanţă'};

  return apiCalls(sectionName, query, instanţe);
};
