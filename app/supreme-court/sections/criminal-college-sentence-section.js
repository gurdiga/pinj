'use strict';

// http://jurisprudenta.csj.md/db_col_penal.php

var CriminalCollegeSentenceSection = {
  toString: function() {
    return 'Hotărîrile Colegiului Penal al CSJ';
  },

  subsectionNames: ['only one'],

  getAPIRequestParams: function(subsectionName, clientName) {
    return {
      url: 'http://jurisprudenta.csj.md/col_penal_grid.php',
      searchOptions: getSearchOptions(clientName)
    };

    function getSearchOptions(clientName) {
      var searchOptions = {
        '_search': true,
        'nd': Date.now(),
        'rows': 500,
        'page': 1,
        'sidx': 'data_pronuntare desc, data_pronuntare',
        'sord': 'desc',
        'filters': {
          'groupOp': 'AND',
          'rules': [
            {'field': 'data_pronuntare', 'op': 'cn', 'data': (new Date()).getFullYear()},
            {'field': 'partea_dosar', 'op': 'cn', 'data': clientName}
          ]
        }
      };

      searchOptions.filters = JSON.stringify(searchOptions.filters);

      return searchOptions;
    }
  },

  rowPreprocessor: function addPdfUrl(row, rowId) {
    row.pdfUrl = 'http://jurisprudenta.csj.md/search_col_penal.php?id=' + rowId;
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
      'title': 'Infracţiunea',
      'index': 4,
      'show': true
    }, {
      'title': 'Problema de drept',
      'index': 5,
      'show': true
    }, {
      'title': 'PDF',
      'index': 'pdfUrl',
      'link': true,
      'show': true
    }
  ]
};

module.exports = CriminalCollegeSentenceSection;
