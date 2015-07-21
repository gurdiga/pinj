'use strict';

// http://agenda.csj.md/plen_penal.php

var ROWID_INDEX = 12;

var CriminalPlenumAgendaSection = {
  toString: function() {
    return 'Agenda şedinţelor Plenului Colegiului Penal al CSJ';
  },

  subsectionNames: ['only one'],

  getAPIRequestParams: function(subsectionName, clientName) {
    return {
      url: 'http://agenda.csj.md/plen_penal_grid.php',
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
          'rules': RULE_PER_QUERY_TYPE[queryType(query)]
        }
      };

      searchOptions.filters = JSON.stringify(searchOptions.filters);

      return searchOptions;
    }
  },

  getRowDate: function(row) {
    var dateString = row[2];
    return dateFromDateString(dateString);
  },

  columns: [
    {
      'title': 'Numărul dosarului',
      'index': 1,
      'show': true
    }, {
      'title': 'Data şedinţei',
      'index': 2,
      'show': true
    }, {
      'title': 'Recurentul',
      'index': 3,
      'show': true
    }, {
      'title': 'Subiectul sesizării',
      'index': 4,
      'show': true
    }, {
      'title': 'Hotărîrea contestată',
      'index': 5,
      'show': true
    }, {
      'title': 'Infracţiunea',
      'index': 6,
      'show': true
    }, {
      'title': 'Ora',
      'index': 7,
      'show': true
    }, {
      'title': 'Sala',
      'index': 8,
      'show': true
    }, {
      'title': 'Procedura',
      'index': 9,
      'show': true
    }, {
      'title': 'Rezultatul examinării',
      'index': 10,
      'show': true
    }, {
      'title': 'Data publicării',
      'index': 11,
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
  return 'http://agenda.csj.md/pdf_creator_plen_penal.php?id=' + row[ROWID_INDEX];
}


module.exports = CriminalPlenumAgendaSection;

var queryType = require('app/util/query-type');
var dateFromDateString = require('app/util/date-from-date-string');
