'use strict';

var SentenceSection = {};

SentenceSection.inquireAbout = function(clientName) {
  var courtIds = Courts.getIds().filter(exclude(['jslb']));

  return forEach(courtIds)
    .inParallel(getResults)
    .then(flattenResults)
    .then(attachColumns(columns));

  function getResults(courtId) {
    var apiRequestOptions = getAPIOptions(courtId, clientName);

    return queryAPI(apiRequestOptions)
      .then(extractRows(addPdfUrl));

    function addPdfUrl(row) {
      var pdfUrlFormat = 'http://instante.justice.md/apps/hotariri_judecata/inst/%s/%s';
      var pdfLink = row[0];
      var hrefRegExp = /a href="([^"]+)"/;

      if (hrefRegExp.test(pdfLink)) {
        var relativePdfUrl = pdfLink.match(hrefRegExp)[1];
        row.pdfUrl = format(pdfUrlFormat, courtId, relativePdfUrl);
      }

      return row;
    }
  }
};

function getAPIOptions(courtId, clientName) {
  return {
    url: 'http://instante.justice.md/apps/hotariri_judecata/inst/' + courtId + '/db_hot_grid.php',
    searchOptions: getSearchOptions(clientName)
  };

  function getSearchOptions(clientName) {
    var searchOptions = {
      '_search': true,
      'nd': Date.now(),
      'rows': 500,
      'page': 1,
      'sidx': 'id',
      'sord': 'asc',
      'filters': {
        'groupOp': 'AND',
        'rules': [
          {'field': 'nr_dosar', 'op': 'cn', 'data': (new Date()).getFullYear()},
          {'field': 'denumire_dosar', 'op': 'cn', 'data': clientName}
        ]
      }
    };

    searchOptions.filters = JSON.stringify(searchOptions.filters);

    return searchOptions;
  }
}

var columns = [{
    'title': 'Denumirea dosarului',
    'index': 3,
    'show': true
  }, {
    'title': 'Numărul dosarului',
    'index': 2,
    'show': true
  }, {
    'title': 'PDF',
    'index': 'pdfUrl',
    'link': true,
    'show': true
  }, {
    'title': 'SKIP',
    'index': 0,
    'show': false
  }, {
    'title': 'Data pronunţării',
    'index': 1,
    'show': false
  }, {
    'title': 'Tipul dosarului',
    'index': 4,
    'show': false
  }, {
    'title': 'SKIP',
    'index': 5,
    'show': false
  }
];

SentenceSection.toString = function() {
  return 'Hotărîrile instanţei';
};

module.exports = SentenceSection;

var format = require('util').format;
var forEach = require('../../util/for-each');
var Courts = require('../courts');
var queryAPI = require('../../util/query-api');
var exclude = require('../../util/exclude');
var flattenResults = require('../../util/flatten-results');
var attachColumns = require('../../util/attach-columns');
var extractRows = require('../../util/extract-rows');
