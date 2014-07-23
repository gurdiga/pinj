'use strict';

function AgendaSection() {
}

AgendaSection.prototype.inquireAbout = function(clientName) {
  var courtIds = Courts.getIds();

  return forEach(courtIds)
    .inParallel(getResults)
    .then(flattenResults);

  function getResults(courtId) {
    var url = AgendaSection.getUrl(courtId);
    var formData = AgendaSection.getFormData(clientName);

    return httpPost(url, formData)
      .then(extractRows)
      .then(augmentRows);

    function extractRows(result) {
      return result.rows.map(function(row) {
        return row.cell;
      });
    }

    function augmentRows(rows) {
      rows.forEach(function(row) {
        row.courtName = Courts.getName(courtId);
      });

      return rows;
    }
  }

  function flattenResults(results) {
    var reduce = require('underscore').reduce;

    var allRows = reduce(results, function(allRows, theseRows) {
      return allRows.concat(theseRows);
    }, []);

    allRows.columns = AgendaSection.columns;

    return allRows;
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

AgendaSection.columns = [{
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
var httpPost = require('../utils/http-post');
