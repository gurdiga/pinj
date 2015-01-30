'use strict';

// http://jurisprudenta.csj.md/db_plen_penal.php

var ROWID_INDEX = 7;

var CriminalPlenumSentenceSection = {
  toString: function() {
    return 'Hotărîrile Plenului Colegiului Penal al CSJ';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://jurisprudenta.csj.md/plen_penal_grid.php';
  },

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
  return 'http://jurisprudenta.csj.md/search_plen_penal.php?id=' + row[ROWID_INDEX];
}

module.exports = CriminalPlenumSentenceSection;

var getQueryType = require('app/util/get-query-type');
