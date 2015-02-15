'use strict';

// http://jurisprudenta.csj.md/db_lista_dosare.php

var ROWID_INDEX = 10;

var CaseInquirySection = {
  toString: function() {
    return 'Cereri pendinte spre examinare la CSJ';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://jurisprudenta.csj.md/grid_lista_dosare.php';
  },

  columns: [
    {
      'title': 'Numărul de înregistrare',
      'index': 1,
      'tableColumnName': 'nr_inregistrare',
      'show': true
    }, {
      'title': 'Data înregistrării',
      'index': 2,
      'tableColumnName': 'data_inregistrare',
      'show': true
    }, {
      'title': 'Numărul dosarului',
      'index': 3,
      'tableColumnName': 'nr_dosar',
      'searchable': true,
      'queryType': 'caseNumber',
      'show': true
    }, {
      'title': 'Statutul',
      'index': 4,
      'tableColumnName': 'statutul_dosarului',
      'show': true
    }, {
      'title': 'Tipul dosarului',
      'index': 5,
      'tableColumnName': 'tip_dosar',
      'show': true
    }, {
      'title': 'Părţile',
      'index': 6,
      'tableColumnName': 'parti_dosar',
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Recurentul/Revizuientul',
      'index': 7,
      'tableColumnName': 'recurent_revizuient',
      'show': true
    }, {
      'title': 'Obiectul',
      'index': 8,
      'tableColumnName': 'obiect_dosar',
      'show': true
    }, {
      'title': 'Procedura',
      'index': 9,
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
  return 'http://jurisprudenta.csj.md/pdf_gen_dosare.php?id=' + row[ROWID_INDEX];
}

module.exports = CaseInquirySection;
