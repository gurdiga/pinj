'use strict';

// http://agenda.csj.md/civil.php

var ROWID_INDEX = 11;

var CivilianCollegeAgendaSection = {
  toString: function() {
    return 'Agenda şedinţelor Colegiului civil, comercial şi de contencios administrativ al CSJ';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://agenda.csj.md/civil_grid.php';
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
      'title': 'Părţile dosarului',
      'index': 2,
      'tableColumnName': 'partea_dosar',
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Instanţa',
      'index': 3,
      'tableColumnName': 'instanta_vizata',
      'show': true
    }, {
      'title': 'Data şedinţei',
      'index': 4,
      'tableColumnName': 'data_sedinta',
      'show': true
    }, {
      'title': 'Ora şedinţei',
      'index': 5,
      'tableColumnName': 'ora_sedinta',
      'show': true
    }, {
      'title': 'Sala şedinţei',
      'index': 6,
      'tableColumnName': 'sala_sedinta',
      'show': true
    }, {
      'title': 'Complet',
      'index': 7,
      'tableColumnName': 'complet_sedinta',
      'show': true
    }, {
      'title': 'Procedura',
      'index': 8,
      'tableColumnName': 'info_aditionale',
      'show': true
    }, {
      'title': 'Rezultatul examinării',
      'index': 9,
      'tableColumnName': 'rezultat_examinare',
      'show': true
    }, {
      'title': 'Data publicării',
      'index': 10,
      'tableColumnName': 'data_inregistrare',
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
  return 'http://agenda.csj.md/pdf_creator_civil.php?id=' + row[ROWID_INDEX];
}

module.exports = CivilianCollegeAgendaSection;
