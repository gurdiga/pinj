'use strict';

var CaseInquirySection = {
  toString: function() {
    return 'Cereri în instanţă';
  },

  subsectionNames: ['only one'],

  getAPIRequestParams: function(subsectionName, clientName) {
    return {
      url: 'http://instante.justice.md/apps/cereri_pendinte/cereri_grid.php',
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
    var currentDate = new Date();

    if (!fileNumber) return currentDate;

    var dateMatch = fileNumber.match(/\d{8}$/);

    if (!dateMatch) return currentDate;

    var dateString = dateMatch[0];

    if (!dateString) return currentDate;

    var dayOfMonth = dateString.substr(0, 2);
    var month = dateString.substr(2, 2);
    var year = dateString.substr(4, 4);

    var date = new Date(year + '-' + month + '-' + dayOfMonth);

    if (date.toString() === 'Invalid Date') return currentDate;

    return date;
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

module.exports = CaseInquirySection;

var queryType = require('app/util/query-type');
