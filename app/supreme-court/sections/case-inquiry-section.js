'use strict';

// http://jurisprudenta.csj.md/db_lista_dosare.php

var ROWID_INDEX = 10;

var CaseInquirySection = {
  toString: function() {
    return 'Cereri pendinte spre examinare la CSJ';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://jurisprudenta.csj.md/grid_lista_dosare.php';
  },

  getAPIRequestParams: function(subsectionName, clientName) {
    return {
      url: 'http://jurisprudenta.csj.md/grid_lista_dosare.php',
      searchOptions: getSearchOptions(clientName)
    };

    function getSearchOptions(query) {
      var RULE_PER_QUERY_TYPE = {
        'caseNumber': [
          {'field': 'nr_inregistrare', 'op': 'cn', 'data': query.substr(1)}
        ],
        'name': [
          {'field': 'parti_dosar', 'op': 'cn', 'data': query}
        ]
      };

      var searchOptions = {
        '_search': true,
        'nd': Date.now(),
        'rows': 500,
        'page': 1,
        'sidx': 'data_inregistrare desc, data_inregistrare',
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
      'title': 'Numărul de înregistrare',
      'index': 1,
      'show': true
    }, {
      'title': 'Data înregistrării',
      'index': 2,
      'show': true
    }, {
      'title': 'Numărul dosarului',
      'index': 3,
      'show': true
    }, {
      'title': 'Statutul',
      'index': 4,
      'show': true
    }, {
      'title': 'Tipul dosarului',
      'index': 5,
      'show': true
    }, {
      'title': 'Părţile',
      'index': 6,
      'show': true
    }, {
      'title': 'Recurentul/Revizuientul',
      'index': 7,
      'show': true
    }, {
      'title': 'Obiectul',
      'index': 8,
      'show': true
    }, {
      'title': 'Procedura',
      'index': 9,
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
  return 'http://jurisprudenta.csj.md/pdf_gen_dosare.php?id=' + row[ROWID_INDEX];
}

module.exports = CaseInquirySection;

var getQueryType = require('app/util/get-query-type');
