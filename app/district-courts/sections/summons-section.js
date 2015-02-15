'use strict';

var SummonsSection = {
  toString: function() {
    return 'Citaţii în instanţă';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://instante.justice.md/apps/citatii_judecata/citatii_grid.php';
  },

  columns: [
    {
      'title': 'Persoana vizată',
      'show': true
    }, {
      'title': 'Calitatea procesuală',
      'getRole': getRole,
      'show': true
    }, {
      'title': 'Data şedinţei',
      'index': 2,
      'tableColumnName': 'data_sedinta',
      'show': true
    }, {
      'title': 'Ora şedinţei',
      'index': 3,
      'tableColumnName': 'ora_sedinta',
      'show': true
    }, {
      'title': 'Instanţa',
      'index': 7,
      'tableColumnName': 'judecatoria_vizata',
      'show': true
    }, {
      'title': 'Obiectul examinării',
      'index': 5,
      'tableColumnName': 'obiectul_examinarii',
      'show': true
    }, {
      'title': 'Numărul dosarului',
      'index': 1,
      'tableColumnName': 'nr_dosar',
      'searchable': true,
      'queryType': 'caseNumber',
      'show': true
    }, {
      'title': 'SKIP',
      'index': 0,
      'tableColumnName': 'PDF',
      'show': false
    }, {
      'title': 'Pîrît',
      'index': 4,
      'tableColumnName': 'persoana_citata',
      'searchable': true,
      'queryType': 'name',
      'used': true
    }, {
      'title': 'Reclamant',
      'index': 6,
      'tableColumnName': 'reclamantul',
      'searchable': true,
      'queryType': 'name',
      'used': true
    }, {
      'title': 'Judecător',
      'index': 8,
      'tableColumnName': 'judecator',
      'show': false
    }, {
      'title': 'Persoana responsabilă',
      'index': 9,
      'tableColumnName': 'nume_grafier',
      'show': false
    }, {
      'title': 'Contacte',
      'index': 10,
      'tableColumnName': 'tel_grefier',
      'show': false
    }, {
      'title': 'Data publicării',
      'index': 11,
      'tableColumnName': 'data_publicare',
      'show': false
    }
  ]
};

function getRole(row, clientName) {
  var accuser = row[6];

  if (accuser.indexOf(clientName) > -1) {
    return 'reclamant';
  } else {
    return 'pîrît';
  }
}

module.exports = SummonsSection;
