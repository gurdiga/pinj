'use strict';

var AgendaSection = {
  toString: function() {
    return 'Agenda şedinţelor';
  },

  subsectionNames: courtLabels(),

  getAPIRequestParams: function(courtLabel, clientName) {
    return {
      url: 'http://instante.justice.md/apps/agenda_judecata/inst/' + courtLabel + '/agenda_grid.php',
      searchOptions: getSearchOptions(clientName)
    };

    function getSearchOptions(query) {
      var RULE_PER_QUERY_TYPE = {
        'caseNumber': [
          {'field': 'nr_dosar', 'op': 'cn', 'data': query.substr(1)}
        ],
        'name': [
          {'field': 'denumire_dosar', 'op': 'cn', 'data': query}
        ]
      };

      var searchOptions = {
        '_search': true,
        'nd': Date.now(),
        'rows': 500,
        'page': 1,
        'sidx': 'data_inregistrare asc, data_inregistrare',
        'sord': 'asc',
        'filters': {
          'groupOp': 'AND',
          'rules': RULE_PER_QUERY_TYPE[queryType(query)]
        }
      };

      searchOptions.filters = JSON.stringify(searchOptions.filters);

      return searchOptions;
    }
  },

  columns: [
    {
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
  ]
};

function courtLabels() {
  var Courts = require('../courts');
  var _ = require('underscore');

  return _(Courts.getIds()).without('jslb');
}

module.exports = AgendaSection;

var queryType = require('app/util/query-type');
