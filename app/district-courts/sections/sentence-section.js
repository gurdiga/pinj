'use strict';

var SentenceSection = {
  toString: function() {
    return 'Hotărîrile instanţei';
  },

  subsectionNames: courtLabels(),

  getURL: function(courtLabel) {
    return 'http://instante.justice.md/apps/hotariri_judecata/inst/' + courtLabel + '/db_hot_grid.php';
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
      'tableColumnName': 'PDF',
      'used': true
    }, {
      'title': 'Denumirea dosarului',
      'index': 3,
      'tableColumnName': 'denumire_dosar',
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Numărul dosarului',
      'index': 2,
      'tableColumnName': 'nr_dosar',
      'searchable': true,
      'queryType': 'caseNumber',
      'show': true
    }, {
      'title': 'PDF',
      'getPDFURL': getPDFURL,
      'show': true
    }, {
      'title': 'Data pronunţării',
      'index': 1,
      'tableColumnName': 'data_deciziei',
      'show': false
    }, {
      'title': 'Tipul dosarului',
      'index': 4,
      'tableColumnName': 'tip_dosar',
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
