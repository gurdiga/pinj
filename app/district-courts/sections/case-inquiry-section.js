'use strict';

var CaseInquirySection = {
  toString: function() {
    return 'Cereri în instanţă';
  },

  subsectionNames: ['only one'],

  getURL: function() {
    return 'http://instante.justice.md/apps/cereri_pendinte/cereri_grid.php';
  },

  columns: [
    {
      'title': 'Părţile',
      'index': 2,
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Tipul dosarului',
      'index': 3,
      'show': true
    }, {
      'title': 'Instanţa',
      'index': 6,
      'show': true
    }, {
      'title': 'Categoria dosarului',
      'index': 4,
      'show': true
    }, {
      'title': 'Statutul dosarului',
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
      'title': 'Data actualizării',
      'index': 6,
      'show': false
    }
  ]
};

module.exports = CaseInquirySection;
