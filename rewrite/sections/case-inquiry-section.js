'use strict';

function CaseInquirySection() {
}

CaseInquirySection.prototype.inquireAbout = function(clientName) {
  return getResults()
      .then(attachColumns(CaseInquirySection));

  function getResults() {
    var apiRequestOptions = CaseInquirySection.getAPIOptions(clientName);

    return queryAPI(apiRequestOptions)
      .then(extractRows);

    function extractRows(result) {
      return result.rows.map(function(row) {
        return row.cell;
      });
    }
  }
};

CaseInquirySection.getAPIOptions = function(clientName) {
  return {
    url: CaseInquirySection.getUrl(),
    searchOptions: CaseInquirySection.getFormData(clientName)
  };
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

CaseInquirySection.columns = [{
    'title': 'Părţile',
    'index': 2,
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
];

CaseInquirySection.prototype.toString = function() {
  return 'Cereri în instanţă';
};

module.exports = CaseInquirySection;

var queryAPI = require('../utils/query-api');
var attachColumns = require('../utils/attach-columns');
