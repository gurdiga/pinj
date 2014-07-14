'use strict';

var querySection = require('../query-section');

module.exports = function cereriÎnInstanţă(query) {
  var instanţe = {'url-unic': 'Cereri în instanţă'};

  return querySection('cereriÎnInstanţă', query, instanţe);
};
