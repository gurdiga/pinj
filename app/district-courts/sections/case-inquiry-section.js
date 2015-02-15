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
      'tableColumnName': 'parti_dosar',
      'searchable': true,
      'queryType': 'name',
      'show': true
    }, {
      'title': 'Tipul dosarului',
      'index': 3,
      'tableColumnName': 'tip_dosar',
      'show': true
    }, {
      'title': 'Instanţa',
      'index': 6,
      'tableColumnName': 'site_name',
      'show': true
    }, {
      'title': 'Categoria dosarului',
      'index': 4,
      'tableColumnName': 'categorie_dosar',
      'show': true
    }, {
      'title': 'Statutul dosarului',
      'index': 5,
      'tableColumnName': 'statut_dosar',
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
      'title': 'Data actualizării',
      'index': 6,
      'tableColumnName': 'data_actualizare',
      'show': false
    }
  ]
};

module.exports = CaseInquirySection;
