'use strict';

// http://jurisprudenta.csj.md/db_lista_dosare.php

var CaseInquirySection = {
  toString: function() {
    return 'Lista cererilor pendinte spre examinare la CSJ';
  },

  subsectionNames: ['only one'],

  getAPIRequestParams: function(subsectionName, clientName) {
    return {
      url: 'http://jurisprudenta.csj.md/grid_lista_dosare.php',
      searchOptions: getSearchOptions(clientName)
    };

    function getSearchOptions(clientName) {
      var searchOptions = {
        '_search': true,
        'nd': Date.now(),
        'rows': 500,
        'page': 1,
        'sidx': 'data_inregistrare desc, data_inregistrare',
        'sord': 'desc',
        'filters': {
          'groupOp': 'AND',
          'rules': [
            {'field': 'data_inregistrare', 'op': 'cn', 'data': (new Date()).getFullYear()},
            {'field': 'parti_dosar', 'op': 'cn', 'data': clientName}
          ]
        }
      };

      searchOptions.filters = JSON.stringify(searchOptions.filters);

      return searchOptions;
    }
  },

  rowPreprocessor: function addPdfUrl(row, rowId) {
    row.pdfUrl = 'http://jurisprudenta.csj.md/pdf_gen_dosare.php?id=' + rowId;
    return row;
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
      'title': 'PDF',
      'index': 'pdfUrl',
      'link': true,
      'show': true
    }
  ]
};


module.exports = CaseInquirySection;
