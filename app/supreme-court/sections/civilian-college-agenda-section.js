'use strict';

// http://agenda.csj.md/civil.php

var ROWID_INDEX = 11;

var CivilianCollegeAgendaSection = {
  toString: function() {
    return 'Agenda şedinţelor Colegiului civil, comercial şi de contencios administrativ al CSJ';
  },

  subsectionNames: ['only one'],

  getAPIRequestParams: function(subsectionName, clientName) {
    return {
      url: 'http://agenda.csj.md/civil_grid.php',
      searchOptions: getSearchOptions(clientName)
    };

    function getSearchOptions(query) {
      var RULE_PER_QUERY_TYPE = {
        'caseNumber': [
          {'field': 'nr_dosar', 'op': 'cn', 'data': query.substr(1)}
        ],
        'name': [
          {'field': 'partea_dosar', 'op': 'cn', 'data': query}
        ]
      };

      var searchOptions = {
        '_search': true,
        'nd': Date.now(),
        'rows': 500,
        'page': 1,
        'sidx': 'data_sedinta desc, data_sedinta',
        'sord': 'desc',
        'filters': {
          'groupOp': 'AND',
          'rules': RULE_PER_QUERY_TYPE[getQueryType(query)]
        }
      };

      searchOptions.filters = JSON.stringify(searchOptions.filters);

      return searchOptions;
    }
  },

  columns: [
    {
      'title': 'Numărul dosarului',
      'index': 1,
      'show': true
    }, {
      'title': 'Părţile dosarului',
      'index': 2,
      'show': true
    }, {
      'title': 'Instanţa',
      'index': 3,
      'show': true
    }, {
      'title': 'Data şedinţei',
      'index': 4,
      'show': true
    }, {
      'title': 'Ora şedinţei',
      'index': 5,
      'show': true
    }, {
      'title': 'Sala şedinţei',
      'index': 6,
      'show': true
    }, {
      'title': 'Complet',
      'index': 7,
      'show': true
    }, {
      'title': 'Procedura',
      'index': 8,
      'show': true
    }, {
      'title': 'Rezultatul examinării',
      'index': 9,
      'show': true
    }, {
      'title': 'Data publicării',
      'index': 10,
      'show': false
    }, {
      'title': 'ROWID',
      'index': ROWID_INDEX,
      'used': true
    }, {
      'title': 'PDF',
      'getPDFURL': getPDFURL,
      'show': true
    }
  ]
};

function getPDFURL(row) {
  return 'http://agenda.csj.md/pdf_creator_civil.php?id=' + row[ROWID_INDEX];
}

module.exports = CivilianCollegeAgendaSection;

var getQueryType = require('app/util/get-query-type');
