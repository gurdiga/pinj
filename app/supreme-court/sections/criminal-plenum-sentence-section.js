'use strict';
// http://jurisprudenta.csj.md/db_plen_penal.php

var CriminalPlenumSentenceSection = {};

CriminalPlenumSentenceSection.inquireAbout = function(clientName) {
  return forEach(['only one'])
    .inParallel(getResults)
    .then(attachColumns(columns));

  function getResults() {
    var apiRequestOptions = getAPIOptions(clientName);

    return queryAPI(apiRequestOptions)
      .then(extractRows(addPdfUrl));

    function addPdfUrl(row, id) {
      row.pdfUrl = 'http://jurisprudenta.csj.md/search_plen_penal.php?id=' + id;
      return row;
    }
  }
};

function getAPIOptions(clientName) {
  return {
    url: 'http://jurisprudenta.csj.md/plen_penal_grid.php',
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
}

var columns = [
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
];

CriminalPlenumSentenceSection.toString = function() {
  return 'Hotărîrile Plenului Colegiului Penal al CSJ';
};

module.exports = CriminalPlenumSentenceSection;

var forEach = require('../../util/for-each');
var queryAPI = require('../../util/query-api');
var attachColumns = require('../../util/attach-columns');
var extractRows = require('../../util/extract-rows');
