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
      'tableColumnName': 'nr_dosar',
      'searchable': true,
      'queryType': 'caseNumber',
      'show': true
    }, {
      'title': 'Data şedinţei',
      'index': 2,
      'tableColumnName': 'data_sedinta',
      'show': true
    }, {
      'title': 'Recurentul',
      'index': 3,
      'tableColumnName': 'recurent',
      'show': true
    }, {
      'title': 'Subiectul sesizării',
      'index': 4,
      'tableColumnName': 'partea_dosar',
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Instanţa',
      'index': 5,
      'tableColumnName': 'instanta_vizata',
      'show': true
    }, {
      'title': 'Infracţiunea',
      'index': 6,
      'tableColumnName': 'infractiune_crima',
      'show': true
    }, {
      'title': 'Ora şedinţei',
      'index': 7,
      'tableColumnName': 'ora_sedinta',
      'show': true
    }, {
      'title': 'Sala şedinţei',
      'index': 8,
      'tableColumnName': 'sala_sedinta',
      'show': true
    }, {
      'title': 'Numărul completului',
      'index': 9,
      'tableColumnName': 'complet_sedinta',
      'show': true
    }, {
      'title': 'Procedura',
      'index': 10,
      'tableColumnName': 'info_aditionale',
      'show': true
    }, {
      'title': 'Rezultatul examinării',
      'index': 11,
      'tableColumnName': 'rezultat_examinare',
      'show': true
    }, {
      'title': 'Data publicării',
      'index': 12,
      'tableColumnName': 'data_inregistrare',
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
