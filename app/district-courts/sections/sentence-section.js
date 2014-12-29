'use strict';

var SentenceSection = {
  toString: function() {
    return 'Hotărîrile instanţei';
  },

  subsectionNames: courtLabels(),

  getAPIRequestParams: function(courtLabel, clientName) {
    return {
      url: 'http://instante.justice.md/apps/hotariri_judecata/inst/' + courtLabel + '/db_hot_grid.php',
      searchOptions: getSearchOptions(clientName)
    };

    function getSearchOptions(query) {
      var RULE_PER_QUERY_TYPE = {
        'caseNumber': [
          {'field': 'nr_dosar', 'op': 'cn', 'data': query.substr(1)}
        ],
        'name': [
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

  rowPreprocessor: function(row) {
    var relativePdfUrl = row[0];
    var caseNo = row[2];

    relativePdfUrl = relativePdfUrl.replace(
      /case_title=Dosar-[^"&]+/,
      'case_title=Dosar-' + caseNo
    );

    row[0] = relativePdfUrl;
    return row;
  },

  columns: [{
      'title': 'relative PDF link',
      'index': 0,
      'used': true
    }, {
      'title': 'Denumirea dosarului',
      'index': 3,
      'show': true
    }, {
      'title': 'Numărul dosarului',
      'index': 2,
      'show': true
    }, {
      'title': 'PDF',
      'getPDFURL': getPDFURL,
      'show': true
    }, {
      'title': 'Data pronunţării',
      'index': 1,
      'show': false
    }, {
      'title': 'Tipul dosarului',
      'index': 4,
      'show': false
    }, {
      'title': 'ROWID',
      'index': 5,
      'show': false
    }
  ]
};

var hrefRegExp = /a href="([^"]+)"/;
var pdfUrlFormat = 'http://instante.justice.md/apps/hotariri_judecata/inst/%s/%s';

function getPDFURL(row, courtLabel) {
  var pdfLink = row[0];
  var relativePdfUrl = pdfLink.match(hrefRegExp)[1];

  return format(pdfUrlFormat, courtLabel, relativePdfUrl);
}

function courtLabels() {
  var Courts = require('../courts');
  var _ = require('underscore');

  return _(Courts.getIds()).without('jslb');
}

module.exports = SentenceSection;

var format = require('util').format;
var queryType = require('app/util/query-type');
