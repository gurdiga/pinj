'use strict';

// http://jurisprudenta.csj.md/db_col_civil.php

var CivilianCollegeSentenceSection = {
  toString: function() {
    return 'Hotărîrile Colegiului civil, comercial şi de contencios administrativ al CSJ';
  },

  subsectionNames: ['only one'],

  getAPIRequestParams: function(subsectionName, clientName) {
    return {
      url: 'http://jurisprudenta.csj.md/col_civil_grid.php',
      searchOptions: getSearchOptions(clientName)
    };

    function getSearchOptions(query) {
      var RULE_PER_QUERY_TYPE = {
        'caseNumber': [
          {'field': 'nr_dosar', 'op': 'cn', 'data': query.substr(1)}
        ],
        'name': [
          {'field': 'data_examinare', 'op': 'cn', 'data': (new Date()).getFullYear()},
          {'field': 'partile_dosar', 'op': 'cn', 'data': query}
        ]
      };

      var searchOptions = {
        '_search': true,
        'nd': Date.now(),
        'rows': 500,
        'page': 1,
        'sidx': 'data_examinare desc, data_examinare',
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
    row.pdfUrl = 'http://jurisprudenta.csj.md/search_col_civil.php?id=' + rowId;
    return row;
  },

  columns: [
    {
      'title': 'Numărul dosarului',
      'index': 1,
      'show': true
    }, {
      'title': 'Data',
      'index': 2,
      'show': true
    }, {
      'title': 'Părţile dosarului',
      'index': 3,
      'show': true
    }, {
      'title': 'Obiectul',
      'index': 4,
      'show': true
    }, {
      'title': 'Problema de drept',
      'index': 5,
      'show': true
    }, {
      'title': 'Procedura',
      'index': 6,
      'show': true
    }, {
      'title': 'PDF',
      'index': 'pdfUrl',
      'link': true,
      'show': true
    }
  ]
};

module.exports = CivilianCollegeSentenceSection;

var queryType = require('../../util/query-type');
