'use strict';

// http://jurisprudenta.csj.md/db_plen_penal.php

var CriminalPlenumSentenceSection = {
  toString: function() {
    return 'Hotărîrile Plenului Colegiului Penal al CSJ';
  },

  subsectionNames: ['only one'],

  getAPIRequestParams: function(subsectionName, clientName) {
    return {
      url: 'http://jurisprudenta.csj.md/plen_penal_grid.php',
      searchOptions: getSearchOptions(clientName)
    };

    function getSearchOptions(query) {
      var RULE_PER_QUERY_TYPE = {
        'caseNumber': [
          {'field': 'nr_dosar', 'op': 'cn', 'data': query.substr(1)}
        ],
        'name': [
          {'field': 'data_pronuntare', 'op': 'cn', 'data': (new Date()).getFullYear()},
          {'field': 'partea_dosar', 'op': 'cn', 'data': query}
        ]
      };

      var searchOptions = {
        '_search': true,
        'nd': Date.now(),
        'rows': 500,
        'page': 1,
        'sidx': 'data_pronuntare desc, data_pronuntare',
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
    row.pdfUrl = 'http://jurisprudenta.csj.md/search_plen_penal.php?id=' + rowId;
    return row;
  },

  columns: [
    {
      'title': 'Numărul dosarului',
      'index': 1,
      'show': true
    }, {
      'title': 'Data pronunţării',
      'index': 2,
      'show': true
    }, {
      'title': 'Părţile dosarului',
      'index': 3,
      'show': true
    }, {
      'title': 'Inforacţiunea',
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

module.exports = CriminalPlenumSentenceSection;

var queryType = require('../../util/query-type');
