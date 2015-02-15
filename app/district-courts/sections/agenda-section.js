'use strict';

var AgendaSection = {
  toString: function() {
    return 'Agenda şedinţelor';
  },

  subsectionNames: courtLabels(),

  getURL: function(courtLabel) {
    return 'http://instante.justice.md/apps/agenda_judecata/inst/' + courtLabel + '/agenda_grid.php';
  },

  columns: [
    {
      'title': 'Părţile dosarului',
      'index': 5,
      'tableColumnName': 'denumire_dosar',
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Data şedinţei',
      'index': 1,
      'tableColumnName': 'data_sedinta',
      'show': true
    }, {
      'title': 'Ora şedinţei',
      'index': 2,
      'tableColumnName': 'ora_sedinta',
      'show': true
    }, {
      'title': 'Instanţa',
      'show': true
    }, {
      'title': 'Sala şedinţei',
      'index': 7,
      'tableColumnName': 'sala_sedinta',
      'show': true
    }, {
      'title': 'Numărul dosarului',
      'index': 4,
      'tableColumnName': 'nr_dosar',
      'searchable': true,
      'queryType': 'caseNumber',
      'show': true
    }, {
      'title': 'SKIP',
      'index': 0,
      'tableColumnName': 'PDF',
      'show': false
    }, {
      'title': 'Tipul dosarului',
      'index': 3,
      'tableColumnName': 'tip_dosar',
      'show': false
    }, {
      'title': 'Tipul şedinţei',
      'index': 6,
      'tableColumnName': 'tip_sedinta',
      'show': false
    }, {
      'title': 'Data actualizării',
      'index': 8,
      'tableColumnName': 'data_inregistrare',
      'show': false
    }
  ]
};

function courtLabels() {
  var Courts = require('../courts');
  var _ = require('underscore');

  return _(Courts.getIds()).without('jslb');
}

module.exports = AgendaSection;
