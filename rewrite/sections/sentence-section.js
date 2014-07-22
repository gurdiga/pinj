'use strict';

function SentenceSection() {
}

SentenceSection.prototype.inquireAbout = function(clientName) {
  var courtIds = Courts.getIds();

  return forEach(courtIds)
    .inParallel(getResults)
    .then(extractRows);

  function getResults(courtId) {
    var url = SentenceSection.getUrl(courtId);
    var formData = SentenceSection.getFormData(clientName);

    return httpPost(url, formData);
  }
};

SentenceSection.getUrl = function(courtId) {
  return 'http://instante.justice.md/apps/hotariri_judecata/inst/' + courtId + '/db_hot_grid.php';
};

SentenceSection.getFormData = function(clientName) {
  var searchOptions = {
    '_search': true,
    'nd': Date.now(),
    'rows': 500,
    'page': 1,
    'sidx': 'id',
    'sord': 'asc',
    'filters': {
      'groupOp': 'AND',
      'rules': [
        {'field': 'nr_dosar', 'op': 'cn', 'data': (new Date()).getFullYear()},
        {'field': 'denumire_dosar', 'op': 'cn', 'data': clientName}
      ]
    }
  };

  searchOptions.filters = JSON.stringify(searchOptions.filters);

  return searchOptions;
};

SentenceSection.title = 'Hotărîrile instanţei';

SentenceSection.columnTitles = [{
    'title': 'Denumirea dosarului',
    'cellIndex': 3,
    'show': true
  }, {
    'title': 'Numărul dosarului',
    'cellIndex': 2,
    'show': true
  }, {
    'title': 'PDF',
    'cellIndex': 101,
    'link': true,
    'show': true
  }, {
    'title': 'SKIP',
    'cellIndex': 0,
    'show': false
  }, {
    'title': 'Data pronunţării',
    'cellIndex': 1,
    'show': false
  }, {
    'title': 'Tipul dosarului',
    'cellIndex': 4,
    'show': false
  }, {
    'title': 'SKIP',
    'cellIndex': 5,
    'show': false
  }
];

SentenceSection.prototype.toString = function() {
  return 'SentenceSection';
};

module.exports = SentenceSection;

var forEach = require('../utils/for-each');
var extractRows = require('./common/extract-rows');
var Courts = require('../courts');
var httpPost = require('../utils/http-post');
