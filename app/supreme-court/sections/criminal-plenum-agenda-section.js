'use strict';

// http://agenda.csj.md/plen_penal.php

var ROWID_INDEX = 12;

var CriminalPlenumAgendaSection = {
  toString: function() {
    return 'Agenda şedinţelor Plenului Colegiului Penal al CSJ';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://agenda.csj.md/plen_penal_grid.php';
  },

  columns: [
    {
      'title': 'Numărul dosarului',
      'index': 1,
      'searchable': true,
      'queryType': 'caseNumber',
      'show': true
    }, {
      'title': 'Data şedinţei',
      'index': 2,
      'show': true
    }, {
      'title': 'Recurentul',
      'index': 3,
      'show': true
    }, {
      'title': 'Subiectul sesizării',
      'index': 4,
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Hotărîrea contestată',
      'index': 5,
      'show': true
    }, {
      'title': 'Infracţiunea',
      'index': 6,
      'show': true
    }, {
      'title': 'Ora',
      'index': 7,
      'show': true
    }, {
      'title': 'Sala',
      'index': 8,
      'show': true
    }, {
      'title': 'Procedura',
      'index': 9,
      'show': true
    }, {
      'title': 'Rezultatul examinării',
      'index': 10,
      'show': true
    }, {
      'title': 'Data publicării',
      'index': 11,
      'show': false
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
  return 'http://agenda.csj.md/pdf_creator_plen_penal.php?id=' + row[ROWID_INDEX];
}

module.exports = CriminalPlenumAgendaSection;
