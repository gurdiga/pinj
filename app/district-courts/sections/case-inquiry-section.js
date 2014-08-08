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

    function getSearchOptions(clientName) {
      var searchOptions = {
        '_search': true,
        'nd': Date.now(),
        'rows': 500,
        'page': 1,
        'sidx': 'site_name desc, site_name',
        'sord': 'desc',
        'filters': {
          'groupOp': 'AND',
          'rules': [
            {'field': 'nr_dosar', 'op': 'cn', 'data': (new Date()).getFullYear()},
            {'field': 'parti_dosar', 'op': 'cn', 'data': clientName}
          ]
        }
      };

      searchOptions.filters = JSON.stringify(searchOptions.filters);

      return searchOptions;
    }
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
