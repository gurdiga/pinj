'use strict';

function SummonsSection() {
}

SummonsSection.prototype.inquireAbout = function(clientName) {
  var url = SummonsSection.getUrl();
  var fieldNames = ['persoana_citata', 'reclamantul'];

  return forEach(fieldNames)
    .inParallel(getResults)
    .then(flattenResults);

  function getResults(fieldName) {
    var formData = SummonsSection.getFormData(fieldName, clientName);

    return httpPost(url, formData)
      .then(extractRows)
      .then(augmentRows);

    function extractRows(result) {
      return result.rows.map(function(row) {
        return row.cell;
      });
    }

    function augmentRows(rows) {
      rows.forEach(setNameAndRole);

      return rows;

      function setNameAndRole(row) {
        var name, role;

        var accuser = row[6];
        var culprit = row[4];
        var foundInCulprit = culprit.indexOf(clientName) > -1;

        if (foundInCulprit) {
          name = culprit;
          role = 'pîrît';
        } else {
          name = accuser;
          role = 'reclamant';
        }

        row.name = name;
        row.role = role;
      }
    }
  }

  function flattenResults(results) {
    var reduce = require('underscore').reduce;

    var allRows = reduce(results, function(allRows, theseRows) {
      return allRows.concat(theseRows);
    }, []);

    allRows.columns = SummonsSection.columns;

    return allRows;
  }
};

SummonsSection.getUrl = function() {
  return 'http://instante.justice.md/apps/citatii_judecata/citatii_grid.php';
};

SummonsSection.getFormData = function(fieldName, clientName) {
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
};

SummonsSection.columns = [{
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
];

SummonsSection.prototype.toString = function() {
  return 'Citaţii în instanţă';
};

module.exports = SummonsSection;

var forEach = require('../utils/for-each');
var httpPost = require('../utils/http-post');
