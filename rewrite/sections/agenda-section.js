'use strict';

function AgendaSection() {
}

AgendaSection.prototype.inquireAbout = function(clientName) {
  var courtIds = Courts.getIds();

  return forEach(courtIds)
    .inParallel(getResults)
    .then(extractRows);

  function getResults(courtId) {
    var url = AgendaSection.getUrl(courtId);
    var formData = AgendaSection.getFormData(clientName);

    return httpPost(url, formData);
  }
};

AgendaSection.getUrl = function(courtId) {
  return 'http://instante.justice.md/apps/agenda_judecata/inst/' + courtId + '/agenda_grid.php';
};

AgendaSection.getFormData = function(clientName) {
  var searchOptions = {
    '_search': true,
    'nd': Date.now(),
    'rows': 500,
    'page': 1,
    'sidx': 'data_inregistrare asc, data_inregistrare',
    'sord': 'asc',
    'filters': {
      'groupOp': 'AND',
      'rules': [
        {'field': 'data_sedinta', 'op': 'cn', 'data': (new Date()).getFullYear()},
        {'field': 'denumire_dosar', 'op': 'cn', 'data': clientName}
      ]
    }
  };

  searchOptions.filters = JSON.stringify(searchOptions.filters);

  return searchOptions;
};

AgendaSection.title = 'Agenda şedinţelor';

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

module.exports = AgendaSection;

var forEach = require('../utils/for-each');
var extractRows = require('./common/extract-rows');
var Courts = require('../courts');
var httpPost = require('../utils/http-post');
