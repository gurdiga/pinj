'use strict';

function AgendaSection() {
}

AgendaSection.prototype.inquireAbout = function(clientName) {
  var courtIds = Courts.getIds().filter(exclude(['jslb']));

  return forEach(courtIds)
    .inParallel(getResults)
    .then(flattenResults)
    .then(attachColumns(columns));

  function getResults(courtId) {
    var apiRequestOptions = getAPIOptions(courtId, clientName);
    var courtName = Courts.getName(courtId);

    return queryAPI(apiRequestOptions)
      .then(extractRows(addCourtName));

    function addCourtName(row) {
      row.courtName = courtName;
      return row;
    }
  }

};

function getAPIOptions(courtId, clientName) {
  return {
    url: 'http://instante.justice.md/apps/agenda_judecata/inst/' + courtId + '/agenda_grid.php',
    searchOptions: getSearchOptions(clientName)
  };

  function getSearchOptions(clientName) {
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
  }
}

var columns = [{
    'title': 'Părţile dosarului',
    'index': 5,
    'show': true
  }, {
    'title': 'Data şedinţei',
    'index': 1,
    'show': true
  }, {
    'title': 'Ora şedinţei',
    'index': 2,
    'show': true
  }, {
    'title': 'Instanţa',
    'index': 'courtName',
    'show': true
  }, {
    'title': 'Sala şedinţei',
    'index': 7,
    'show': true
  }, {
    'title': 'Numărul dosarului',
    'index': 4,
    'show': true
  }, {
    'title': 'SKIP',
    'index': 0,
    'show': false
  }, {
    'title': 'Tipul dosarului',
    'index': 3,
    'show': false
  }, {
    'title': 'Tipul şedinţei',
    'index': 6,
    'show': false
  }, {
    'title': 'Data actualizării',
    'index': 8,
    'show': false
  }
];

AgendaSection.prototype.toString = function() {
  return 'Agenda şedinţelor';
};

module.exports = AgendaSection;

var forEach = require('../utils/for-each');
var Courts = require('../courts');
var queryAPI = require('../utils/query-api');
var exclude = require('../utils/exclude');
var flattenResults = require('../utils/flatten-results');
var attachColumns = require('../utils/attach-columns');
var extractRows = require('../utils/extract-rows');
