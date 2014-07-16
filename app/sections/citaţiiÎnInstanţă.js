'use strict';

var querySection = require('../query-section');

module.exports = function citaţiiÎnInstanţă(query) {
  var courts = {'url-unic': 'Cereri în instanţă'};

  return querySection('citaţiiÎnInstanţă', query, courts);
};
