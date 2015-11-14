'use strict';

// http://instante.justice.md/apps/cereri_pendinte/cereri.php

var CaseInquirySection = {
  toString: function() {
    return 'Cereri în instanţă';
  },

  slugName: 'case-inquiries',

  subsectionNames: ['only one'],

  getAPIRequestParamsForBulkDownload: function(pageNumber) {
    return {
      url: getURL(),
      searchOptions: getBulkDownloadOptions(pageNumber)
    };
  },

  getAPIRequestParams: function(subsectionName, clientName) {
    return {
      url: getURL(),
      searchOptions: getSearchOptions(clientName)
    };

    function getSearchOptions(query) {
      var RULE_PER_QUERY_TYPE = {
        'caseNumber': [
          {'field': 'nr_dosar', 'op': 'cn', 'data': query.substr(1)}
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
        'sidx': 'site_name desc, site_name',
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
    var fileNumber = row[1];
    return dateFromFileNumber(fileNumber);
  },

  columns: [
    {
      'title': 'Părţile',
      'index': 2,
      'show': true
    }, {
      'title': 'Tipul dosarului',
      'index': 3,
      'show': true
    }, {
      'title': 'Instanţa',
      'index': 6,
      'show': true
    }, {
      'title': 'Categoria dosarului',
      'index': 4,
      'show': true
    }, {
      'title': 'Statutul dosarului',
      'index': 5,
      'show': true
    }, {
      'title': 'Numărul dosarului',
      'index': 1,
      'show': true
    }, {
      'title': 'SKIP',
      'index': 0,
      'show': false
    }, {
      'title': 'Data actualizării',
      'index': 6,
      'show': false
    }
  ]
};

function getURL() {
  return 'http://instante.justice.md/apps/cereri_pendinte/cereri_grid.php';
}

module.exports = CaseInquirySection;

var queryType = require('app/util/query-type');
var dateFromFileNumber = require('app/util/date-from-file-number');
var getBulkDownloadOptions = require('app/util/get-bulk-download-options');
