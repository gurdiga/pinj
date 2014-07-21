'use strict';

function SummonsSection() {
}

SummonsSection.title = 'Citaţii în instanţă';

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
  return 'SummonsSection';
};

SummonsSection.getUrl = function() {
  return 'http://instante.justice.md/apps/citatii_judecata/citatii_grid.php';
};

SummonsSection.getFormData = function(clientName) {
  var searchOptions = {
    '_search': true,
    'nd': Date.now(),
    'rows': 500,
    'page': 1,
    'sidx': 'judecatoria_vizata desc, judecatoria_vizata',
    'sord': 'desc',
    'filters': {
      'groupOp': 'OR',
      'rules': [
        {'field': 'reclamantul', 'op': 'cn', 'data': clientName},
        {'field': 'persoana_citata', 'op': 'cn', 'data': clientName}
      ]
    }
  };

  searchOptions.filters = JSON.stringify(searchOptions.filters);

  return searchOptions;
};

SummonsSection.prototype.inquireAbout = function(clientName) {
  var httpPost = require('../utils/http-post');

  // TODO
  // - add filter by year??
  // - import the data augmentation code from the old version

  var url = SummonsSection.getUrl();
  var formData = SummonsSection.getFormData(clientName);

  return httpPost(url, formData);
};

module.exports = SummonsSection;
