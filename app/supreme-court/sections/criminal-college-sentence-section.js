'use strict';

// http://jurisprudenta.csj.md/db_col_penal.php

var ROWID_INDEX = 7;

var CriminalCollegeSentenceSection = {
  toString: function() {
    return 'Hotărîrile Colegiului Penal al CSJ';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://jurisprudenta.csj.md/col_penal_grid.php';
  },

  columns: [
    {
      'title': 'Numărul dosarului',
      'index': 1,
      'searchable': true,
      'queryType': 'caseNumber',
      'show': true
    }, {
      'title': 'Data pronunţării',
      'index': 2,
      'show': true
    }, {
      'title': 'Părţile dosarului',
      'index': 3,
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Infracţiunea',
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
      'title': 'ROWID',
      'index': ROWID_INDEX,
      'used': true
    }, {
      'title': 'PDF',
      'getPDFURL': getPDFURL,
      'show': true
    }
  ]
};

function getPDFURL(row) {
  return 'http://jurisprudenta.csj.md/search_col_penal.php?id=' + row[ROWID_INDEX];
}

module.exports = CriminalCollegeSentenceSection;
