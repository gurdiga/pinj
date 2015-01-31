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
      'show': true
    }, {
      'title': 'Ora şedinţei',
      'index': 3,
      'show': true
    }, {
      'title': 'Instanţa',
      'index': 7,
      'show': true
    }, {
      'title': 'Obiectul examinării',
      'index': 5,
      'show': true
    }, {
      'title': 'Numărul dosarului',
      'index': 1,
      'searchable': true,
      'queryType': 'caseNumber',
      'show': true
    }, {
      'title': 'SKIP',
      'index': 0,
      'show': false
    }, {
      'title': 'Pîrît',
      'index': 4,
      'searchable': true,
      'queryType': 'name',
      'used': true
    }, {
      'title': 'Reclamant',
      'index': 6,
      'searchable': true,
      'queryType': 'name',
      'used': true
    }, {
      'title': 'Judecător',
      'index': 8,
      'show': false
    }, {
      'title': 'Persoana responsabilă',
      'index': 9,
      'show': false
    }, {
      'title': 'Contacte',
      'index': 10,
      'show': false
    }, {
      'title': 'Data publicării',
      'index': 11,
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
