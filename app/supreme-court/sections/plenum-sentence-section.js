'use strict';
// http://jurisprudenta.csj.md/db_plen_csj.php

var PlenumSentenceSection = {};

PlenumSentenceSection.inquireAbout = function(clientName) {
  return forEach(['only one'])
    .inParallel(getResults)
    .then(attachColumns(columns));

  function getResults() {
    var apiRequestOptions = getAPIOptions(clientName);

    return queryAPI(apiRequestOptions)
      .then(extractRows(addPdfUrl));

    function addPdfUrl(row, id) {
      row.pdfUrl = 'http://jurisprudenta.csj.md/search_plen_csj.php?id=' + id;
      return row;
    }
  }
};

function getAPIOptions(clientName) {
  return {
    url: 'http://jurisprudenta.csj.md/plen_csj_grid.php',
    searchOptions: getSearchOptions(clientName)
  };

  function getSearchOptions(clientName) {
    var searchOptions = {
      '_search': true,
      'nd': Date.now(),
      'rows': 500,
      'page': 1,
      'sidx': 'data_examinare desc, data_examinare',
      'sord': 'desc',
      'filters': {
        'groupOp': 'AND',
        'rules': [
          {'field': 'data_examinare', 'op': 'cn', 'data': (new Date()).getFullYear()},
          {'field': 'obiectul_examinarii', 'op': 'cn', 'data': clientName}
        ]
      }
    };

    searchOptions.filters = JSON.stringify(searchOptions.filters);

    return searchOptions;
  }
}

var columns = [
  {
    'title': 'Numărul dosarului',
    'index': 1,
    'show': true
  }, {
    'title': 'Data',
    'index': 2,
    'show': true
  }, {
    'title': 'Obiectul examinării',
    'index': 3,
    'show': true
  }, {
    'title': 'Procedura',
    'index': 4,
    'show': true
  }, {
    'title': 'PDF',
    'index': 'pdfUrl',
    'link': true,
    'show': true
  }
];

PlenumSentenceSection.toString = function() {
  return 'Hotărîrile Plenului CSJ';
};

module.exports = PlenumSentenceSection;

var forEach = require('../../util/for-each');
var queryAPI = require('../../util/query-api');
var attachColumns = require('../../util/attach-columns');
var extractRows = require('../../util/extract-rows');
