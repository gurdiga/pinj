'use strict';

var SummonsSection = {
  toString: function() {
    return 'Citaţii în instanţă';
  },

  subsectionNames: ['persoana_citata', 'reclamantul'],

  getAPIRequestParams: function(fieldName, clientName) {
    return {
      url: 'http://instante.justice.md/apps/citatii_judecata/citatii_grid.php',
      searchOptions: getSearchOptions(fieldName, clientName)
    };

    function getSearchOptions(fieldName, clientName) {
      var searchOptions = {
        '_search': true,
        'nd': Date.now(),
        'rows': 500,
        'page': 1,
        'sidx': 'judecatoria_vizata desc, judecatoria_vizata',
        'sord': 'desc',
        'filters': {
          'groupOp': 'AND',
          'rules': [
            {'field': 'data_sedinta', 'op': 'cn', 'data': (new Date()).getFullYear()},
            {'field': fieldName, 'op': 'cn', 'data': clientName}
          ]
        }
      };

      searchOptions.filters = JSON.stringify(searchOptions.filters);

      return searchOptions;
    }
  },

  rowPreprocessor: function addRoleAndName(row, rowId, fieldName) {
    var name, role;

    var accuser = row[6];
    var culprit = row[4];

    if (fieldName === 'persoana_citata') {
      name = culprit;
      role = 'pîrît';
    } else {
      name = accuser;
      role = 'reclamant';
    }

    row.name = name;
    row.role = role;

    return row;
  },

  columns: [
    {
      'title': 'Persoana vizată',
      'index': 'name',
      'show': true
    }, {
      'title': 'Calitatea procesuală',
      'index': 'role',
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
      'show': true
    }, {
      'title': 'SKIP',
      'index': 0,
      'show': false
    }, {
      'title': 'Pîrît',
      'index': 4,
      'show': false
    }, {
      'title': 'Reclamant',
      'index': 6,
      'show': false
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

module.exports = SummonsSection;
