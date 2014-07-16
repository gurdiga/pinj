'use strict';

var clone = require('../clone');
var courts = require('../meta').courts;
var querySection = require('../query-section');

module.exports = function hotărîrileInstanţei(query) {
  courts = clone(courts);

  // pare să nu fie implementată pentru Slobozia
  // http://instante.justice.md/cms/curtea-de-apel-bender/jslb-menu
  delete courts.jslb;

  return querySection('hotărîrileInstanţei', query, courts);
};
