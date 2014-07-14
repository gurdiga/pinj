'use strict';

var instanţe = require('../meta').instanţe;
var querySection = require('../query-section');

module.exports = function hotărîrileInstanţei(query) {
  // pare să nu fie implementată pentru Slobozia
  // http://instante.justice.md/cms/curtea-de-apel-bender/jslb-menu
  delete instanţe.jslb;

  return querySection('hotărîrileInstanţei', query, instanţe);
};
