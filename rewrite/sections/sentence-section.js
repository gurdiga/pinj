'use strict';

function SentenceSection() {
}

SentenceSection.prototype.inquireAbout = function(clientName) {
  var courtIds = Courts.getIds();

  return forEach(courtIds)
    .inParallel(getResults)
    .then(flattenResults);

  function getResults(courtId) {
    var url = SentenceSection.getUrl(courtId);
    var formData = SentenceSection.getFormData(clientName);

    return httpPost(url, formData)
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

    return reduce(results, function(allRows, theseRows) {
      return allRows.concat(theseRows);
    }, []);
  }

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

SentenceSection.columnTitles = [{
    'title': 'Denumirea dosarului',
    'cellIndex': 3,
    'show': true
  }, {
    'title': 'Numărul dosarului',
    'cellIndex': 2,
    'show': true
  }, {
    'title': 'PDF',
    'cellIndex': 101,
    'link': true,
    'show': true
  }, {
    'title': 'SKIP',
    'cellIndex': 0,
    'show': false
  }, {
    'title': 'Data pronunţării',
    'cellIndex': 1,
    'show': false
  }, {
    'title': 'Tipul dosarului',
    'cellIndex': 4,
    'show': false
  }, {
    'title': 'SKIP',
    'cellIndex': 5,
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
var httpPost = require('../utils/http-post');
