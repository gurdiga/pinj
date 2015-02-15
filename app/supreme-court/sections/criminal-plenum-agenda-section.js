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
      'title': 'Ora',
      'index': 7,
      'tableColumnName': 'ora_sedinta',
      'show': true
    }, {
      'title': 'Sala',
      'index': 8,
      'tableColumnName': 'sala_sedinta',
      'show': true
    }, {
      'title': 'Procedura',
      'index': 9,
      'tableColumnName': 'info_aditionale',
      'show': true
    }, {
      'title': 'Rezultatul examinării',
      'index': 10,
      'tableColumnName': 'rezultat_examinare',
      'show': true
    }, {
      'title': 'Data publicării',
      'index': 11,
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
  return 'http://agenda.csj.md/pdf_creator_plen_penal.php?id=' + row[ROWID_INDEX];
}

module.exports = CriminalPlenumAgendaSection;
