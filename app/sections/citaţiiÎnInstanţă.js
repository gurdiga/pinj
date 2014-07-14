'use strict';

var querySection = require('../query-section');

module.exports = function citaţiiÎnInstanţă(query) {
  var instanţe = {'url-unic': 'Cereri în instanţă'};

  return querySection('citaţiiÎnInstanţă', query, instanţe);
};
