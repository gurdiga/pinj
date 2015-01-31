'use strict';

// http://agenda.csj.md/penal.php

var ROWID_INDEX = 13;

var CriminalCollegeAgendaSection = {
  toString: function() {
    return 'Agenda şedinţelor Colegiului Penal al CSJ';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://agenda.csj.md/penal_grid.php';
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
      'title': 'Ora şedinţei',
      'index': 7,
      'show': true
    }, {
      'title': 'Sala şedinţei',
      'index': 8,
      'show': true
    }, {
      'title': 'Numărul completului',
      'index': 9,
      'show': true
    }, {
      'title': 'Procedura',
      'index': 10,
      'show': true
    }, {
      'title': 'Rezultatul examinării',
      'index': 11,
      'show': true
    }, {
      'title': 'Data publicării',
      'index': 12,
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
  return 'http://agenda.csj.md/pdf_creator_penal.php?id=' + row[ROWID_INDEX];
}

module.exports = CriminalCollegeAgendaSection;
