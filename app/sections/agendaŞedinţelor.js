'use strict';

var instanţe = require('../meta').instanţe;
var apiCalls = require('./common/apiCalls');
var moduleName = require('./common/moduleName');

module.exports = function agendaŞedinţelor(query) {
  var sectionId = moduleName(module);

  // pare să nu fie implementată pentru Slobozia
  // http://instante.justice.md/cms/curtea-de-apel-bender/jslb-menu
  delete instanţe.jslb;

  return apiCalls(sectionId, query, instanţe);
};
