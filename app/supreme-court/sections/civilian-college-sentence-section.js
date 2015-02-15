'use strict';

// http://jurisprudenta.csj.md/db_col_civil.php

var ROWID_INDEX = 7;

var CivilianCollegeSentenceSection = {
  toString: function() {
    return 'Hotărîrile Colegiului civil, comercial şi de contencios administrativ al CSJ';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://jurisprudenta.csj.md/col_civil_grid.php';
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
      'title': 'Data',
      'index': 2,
      'tableColumnName': 'data_examinare',
      'show': true
    }, {
      'title': 'Părţile dosarului',
      'index': 3,
      'tableColumnName': 'partile_dosar',
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Obiectul',
      'index': 4,
      'tableColumnName': 'obiectul_litigiului',
      'show': true
    }, {
      'title': 'Problema de drept',
      'index': 5,
      'tableColumnName': 'problema_juridica',
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
  return 'http://jurisprudenta.csj.md/search_col_civil.php?id=' + row[ROWID_INDEX];
}

module.exports = CivilianCollegeSentenceSection;
