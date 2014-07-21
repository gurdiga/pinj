'use strict';

function AgendaSection() {
}

AgendaSection.title = 'Agenda şedinţelor';
AgendaSection.urlFormat = 'http://instante.justice.md/apps/agenda_judecata/inst/%s/agenda_grid.php';

AgendaSection.searchOptions = {
  'sidx': 'data_inregistrare asc, data_inregistrare',
  'sord': 'asc',
  'filters': {
    'groupOp': 'AND',
    'rules': [
      {'field': 'data_sedinta', 'op': 'cn', 'data': '%CURRENT_YEAR%'},
      {'field': 'denumire_dosar', 'op': 'cn', 'data': '%QUERY%'}
    ]
  }
};

AgendaSection.columnTitles = [{
    'title': 'Părţile',
    'cellIndex': 5,
    'show': true
  }, {
    'title': 'Data şedinţei',
    'cellIndex': 1,
    'show': true
  }, {
    'title': 'Ora şedinţei',
    'cellIndex': 2,
    'show': true
  }, {
    'title': 'Instanţa',
    'cellIndex': 100,
    'show': true
  }, {
    'title': 'Sala şedinţei',
    'cellIndex': 7,
    'show': true
  }, {
    'title': 'Numărul dosarului',
    'cellIndex': 4,
    'show': true
  }, {
    'title': 'SKIP',
    'cellIndex': 0,
    'show': false
  }, {
    'title': 'Tipul dosarului',
    'cellIndex': 3,
    'show': false
  }, {
    'title': 'Tipul şedinţei',
    'cellIndex': 6,
    'show': false
  }, {
    'title': 'Data actualizării',
    'cellIndex': 8,
    'show': false
  }
];

AgendaSection.prototype.toString = function() {
  return 'AgendaSection';
};

AgendaSection.prototype.inquireAbout = function(clientName) {
  console.log('AgendaSection inquireAbout', clientName);

  var forEach = require('../utils/for-each');
  var Courts = require('../courts');
  var courtIds = Courts.getIds();

  return forEach(courtIds).inParallel(function(courtId) {
    return forEach.todo('Query court ' + courtId + '’s API for ' + clientName);
  });
};

module.exports = AgendaSection;
