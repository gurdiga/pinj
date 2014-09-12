'use strict';

var SentenceSection = {
  toString: function() {
    return 'Hotărîrile instanţei';
  },

  subsectionNames: courtIds(),

  getAPIRequestParams: function(courtId, clientName) {
    return {
      url: 'http://instante.justice.md/apps/hotariri_judecata/inst/' + courtId + '/db_hot_grid.php',
      searchOptions: getSearchOptions(clientName)
    };

    function getSearchOptions(query) {
      var RULE_PER_QUERY_TYPE = {
        'caseNumber': [
          {'field': 'nr_dosar', 'op': 'cn', 'data': query.substr(1)}
        ],
        'name': [
          {'field': 'nr_dosar', 'op': 'cn', 'data': (new Date()).getFullYear()},
          {'field': 'denumire_dosar', 'op': 'cn', 'data': query}
        ]
      };

      var searchOptions = {
        '_search': true,
        'nd': Date.now(),
        'rows': 500,
        'page': 1,
        'sidx': 'id',
        'sord': 'asc',
        'filters': {
          'groupOp': 'AND',
          'rules': RULE_PER_QUERY_TYPE[queryType(query)]
        }
      };

      searchOptions.filters = JSON.stringify(searchOptions.filters);

      return searchOptions;
    }
  },

  rowPreprocessor: function addPdfUrl(row, rowId, courtId) {
    var pdfUrlFormat = 'http://instante.justice.md/apps/hotariri_judecata/inst/%s/%s';
    var pdfLink = row[0];
    var hrefRegExp = /a href="([^"]+)"/;

    if (hrefRegExp.test(pdfLink)) {
      var relativePdfUrl = pdfLink.match(hrefRegExp)[1];
      row.pdfUrl = format(pdfUrlFormat, courtId, relativePdfUrl);
    }

    return row;
  },

  columns: [{
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
  ]
};

module.exports = SentenceSection;

var format = require('util').format;
var queryType = require('../../util/query-type');

function courtIds() {
  var Courts = require('../courts');
  var _ = require('underscore');

  return _(Courts.getIds()).without('jslb');
}
