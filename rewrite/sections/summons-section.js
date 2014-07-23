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
      rows.forEach(function(row) {
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
      });

      return rows;
    }
  }

  function flattenResults(results) {
    var reduce = require('underscore').reduce;

    return reduce(results, function(allRows, theseRows) {
      return allRows.concat(theseRows);
    }, []);
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

SummonsSection.columnTitles = [{
    'title': 'Persoana vizată',
    'cellIndex': 102,
    'show': true
  }, {
    'title': 'Calitatea procesuală',
    'cellIndex': 103,
    'show': true
  }, {
    'title': 'Data şedinţei',
    'cellIndex': 2,
    'show': true
  }, {
    'title': 'Ora şedinţei',
    'cellIndex': 3,
    'show': true
  }, {
    'title': 'Instanţa',
    'cellIndex': 7,
    'show': true
  }, {
    'title': 'Obiectul examinării',
    'cellIndex': 5,
    'show': true
  }, {
    'title': 'Numărul dosarului',
    'cellIndex': 1,
    'show': true
  }, {
    'title': 'SKIP',
    'cellIndex': 0,
    'show': false
  }, {
    'title': 'Pîrît',
    'cellIndex': 4,
    'show': false
  }, {
    'title': 'Reclamant',
    'cellIndex': 6,
    'show': false
  }, {
    'title': 'Judecător',
    'cellIndex': 8,
    'show': false
  }, {
    'title': 'Persoana responsabilă',
    'cellIndex': 9,
    'show': false
  }, {
    'title': 'Contacte',
    'cellIndex': 10,
    'show': false
  }, {
    'title': 'Data publicării',
    'cellIndex': 11,
    'show': false
  }
];

SummonsSection.prototype.toString = function() {
  return 'Citaţii în instanţă';
};

module.exports = SummonsSection;

var forEach = require('../utils/for-each');
var httpPost = require('../utils/http-post');
