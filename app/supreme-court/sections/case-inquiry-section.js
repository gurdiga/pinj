'use strict';
// http://jurisprudenta.csj.md/db_lista_dosare.php

var CaseInquirySection = {};

CaseInquirySection.inquireAbout = function(clientName) {
  return forEach(['only one'])
    .inParallel(getResults)
    .then(attachColumns(columns));

  function getResults() {
    var apiRequestOptions = getAPIOptions(clientName);

    return queryAPI(apiRequestOptions)
      .then(extractRows(addPdfUrl));

    function addPdfUrl(row, id) {
      row.pdfUrl = 'http://jurisprudenta.csj.md/pdf_gen_dosare.php?id=' + id;
      return row;
    }
  }
};

function getAPIOptions(clientName) {
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
}

var columns = [
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
];

CaseInquirySection.toString = function() {
  return 'Lista cererilor pendinte spre examinare la CSJ';
};

module.exports = CaseInquirySection;

var forEach = require('../../util/for-each');
var queryAPI = require('../../util/query-api');
var attachColumns = require('../../util/attach-columns');
var extractRows = require('../../util/extract-rows');
