'use strict';

// http://agenda.csj.md/penal.php

var CriminalCollegeAgendaSection = {
  toString: function() {
    return 'Agenda şedinţelor Colegiului Penal al CSJ';
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

  rowPreprocessor: function addPdfUrl(row, rowId) {
    row.pdfUrl = 'http://agenda.csj.md/pdf_creator_plen_penal.php?id=' + rowId;
    return row;
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
      'title': 'Ora şedinţei',
      'index': 7,
      'show': true
    }, {
      'title': 'Sala şedinţei',
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
      'title': 'PDF',
      'index': 'pdfUrl',
      'link': true,
      'show': true
    }
  ]
};

module.exports = CriminalCollegeAgendaSection;

var queryType = require('../../util/query-type');
