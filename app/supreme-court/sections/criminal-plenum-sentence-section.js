'use strict';

// http://jurisprudenta.csj.md/db_plen_penal.php

var ROWID_INDEX = 7;

var CriminalPlenumSentenceSection = {
  toString: function() {
    return 'Hotărîrile Plenului Colegiului Penal al CSJ';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://jurisprudenta.csj.md/plen_penal_grid.php';
  },

  columns: [
    {
      'title': 'Numărul dosarului',
      'index': 1,
      'tableColumnName': 'nr_dosar',
      'searchable': true,
      'queryType': 'caseNumber',
      'show': true
    }, {
      'title': 'Data pronunţării',
      'index': 2,
      'tableColumnName': 'data_pronuntare',
      'show': true
    }, {
      'title': 'Părţile dosarului',
      'index': 3,
      'tableColumnName': 'partea_dosar',
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Inforacţiunea',
      'index': 4,
      'tableColumnName': 'infractiunea_crime',
      'show': true
    }, {
      'title': 'Problema de drept',
      'index': 5,
      'tableColumnName': 'art_cp_cpp',
      'show': true
    }, {
      'title': 'Procedura',
      'index': 6,
      'tableColumnName': 'procedura_examinare',
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
  return 'http://jurisprudenta.csj.md/search_plen_penal.php?id=' + row[ROWID_INDEX];
}

module.exports = CriminalPlenumSentenceSection;
