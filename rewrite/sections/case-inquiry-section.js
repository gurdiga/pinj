'use strict';

function CaseInquirySection() {
}

CaseInquirySection.prototype.inquireAbout = function(clientName) {
  var extractRows = require('./common/extract-rows');

  return getResults().then(extractRows);

  function getResults() {
    var httpPost = require('../utils/http-post');

    var url = CaseInquirySection.getUrl();
    var formData = CaseInquirySection.getFormData(clientName);

    return httpPost(url, formData);
  }
};

CaseInquirySection.getUrl = function() {
  return 'http://instante.justice.md/apps/cereri_pendinte/cereri_grid.php';
};

CaseInquirySection.getFormData = function(clientName) {
  var searchOptions = {
    '_search': true,
    'nd': Date.now(),
    'rows': 500,
    'page': 1,
    'sidx': 'site_name desc, site_name',
    'sord': 'desc',
    'filters': {
      'groupOp': 'AND',
      'rules': [
        {'field': 'nr_dosar', 'op': 'cn', 'data': (new Date()).getFullYear()},
        {'field': 'parti_dosar', 'op': 'cn', 'data': clientName}
      ]
    }
  };

  searchOptions.filters = JSON.stringify(searchOptions.filters);

  return searchOptions;
};

CaseInquirySection.title = 'Cereri în instanţă';

CaseInquirySection.columnTitles = [{
    'title': 'Părţile',
    'cellIndex': 2,
    'show': true
  }, {
    'title': 'Tipul dosarului',
    'cellIndex': 3,
    'show': true
  }, {
    'title': 'Instanţa',
    'cellIndex': 6,
    'show': true
  }, {
    'title': 'Categoria dosarului',
    'cellIndex': 4,
    'show': true
  }, {
    'title': 'Statutul dosarului',
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
    'title': 'Data actualizării',
    'cellIndex': 6,
    'show': false
  }
];

CaseInquirySection.prototype.toString = function() {
  return 'CaseInquirySection';
};

module.exports = CaseInquirySection;
