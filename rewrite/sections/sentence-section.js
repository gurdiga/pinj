'use strict';

function SentenceSection() {
}

SentenceSection.prototype.inquireAbout = function(clientName) {
  var courtIds = Courts.getIds().filter(exclude(['jslb']));

  return forEach(courtIds)
    .inParallel(getResults)
    .then(flattenResults);

  function getResults(courtId) {
    var apiRequestOptions = SentenceSection.getAPIOptions(courtId, clientName);

    return queryAPI(apiRequestOptions)
      .then(extractRows)
      .then(augmentRows);

    function extractRows(result) {
      return result.rows.map(function(row) {
        return row.cell;
      });
    }

    function augmentRows(rows) {
      var pdfUrlFormat = SentenceSection.getPdfUrlFormat();

      rows.forEach(function(row) {
        var pdfLink = row[0];
        var hrefRegExp = /a href="([^"]+)"/;

        if (hrefRegExp.test(pdfLink)) {
          var relativePdfUrl = pdfLink.match(hrefRegExp)[1];
          row.pdfUrl = format(pdfUrlFormat, courtId, relativePdfUrl);
        }
      });

      return rows;
    }
  }

  function flattenResults(results) {
    var reduce = require('underscore').reduce;

    var allRows = reduce(results, function(allRows, theseRows) {
      return allRows.concat(theseRows);
    }, []);

    allRows.columns = SentenceSection.columns;

    return allRows;
  }

};

SentenceSection.getAPIOptions = function(courtId, clientName) {
  return {
    url: SentenceSection.getUrl(courtId),
    searchOptions: SentenceSection.getFormData(clientName)
  };
};

SentenceSection.getUrl = function(courtId) {
  return 'http://instante.justice.md/apps/hotariri_judecata/inst/' + courtId + '/db_hot_grid.php';
};

SentenceSection.getPdfUrlFormat = function() {
  return 'http://instante.justice.md/apps/hotariri_judecata/inst/%s/%s';
};

SentenceSection.getFormData = function(clientName) {
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
};

SentenceSection.columns = [{
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

SentenceSection.prototype.toString = function() {
  return 'Hotărîrile instanţei';
};

module.exports = SentenceSection;

var format = require('util').format;
var forEach = require('../utils/for-each');
var Courts = require('../courts');
var queryAPI = require('../utils/query-api');
var exclude = require('../utils/exclude');
