'use strict';
// http://jurisprudenta.csj.md/db_cont_csm.php

var AppealPanelSentenceSection = {};

AppealPanelSentenceSection.inquireAbout = function(clientName) {
  return forEach(['only one'])
    .inParallel(getResults)
    .then(attachColumns(columns));

  function getResults() {
    var apiRequestOptions = getAPIOptions(clientName);

    return queryAPI(apiRequestOptions)
      .then(extractRows(addPdfUrl));

    function addPdfUrl(row, id) {
      row.pdfUrl = 'http://jurisprudenta.csj.md/search_cont_csm.php?id=' + id;
      return row;
    }
  }
};

function getAPIOptions(clientName) {
  return {
    url: 'http://jurisprudenta.csj.md/cont_csm_grid.php',
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
          {'field': 'partile_dosar', 'op': 'cn', 'data': clientName}
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
    'title': 'Părţile dosarului',
    'index': 3,
    'show': true
  }, {
    'title': 'Hotărîrea contestată',
    'index': 4,
    'show': true
  }, {
    'title': 'PDF',
    'index': 'pdfUrl',
    'link': true,
    'show': true
  }
];

AppealPanelSentenceSection.toString = function() {
  return 'Hotărîrile CSJ privind contestaţiile hotărîrilor CSM';
};

module.exports = AppealPanelSentenceSection;

var forEach = require('../../util/for-each');
var queryAPI = require('../../util/query-api');
var attachColumns = require('../../util/attach-columns');
var extractRows = require('../../util/extract-rows');
