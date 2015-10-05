'use strict';

var util = require('util');
var queryAPI = require('app/util/query-api');
var section = require('app/district-courts/sections/agenda-section');

var m0 = process.memoryUsage();

requestPage(1)
.then(function(v) {
  console.log(v.rows.length);
  console.log(v.rows[0]);

  var m1 = process.memoryUsage();
  console.log('heapTotal', (m1.heapTotal - m0.heapTotal) / 1024 / 1024);
  console.log('heapUsed', (m1.heapUsed - m0.heapUsed) / 1024 / 1024);
  console.log('rss', (m1.rss - m0.rss) / 1024 / 1024);

});


function requestPage(pageNo) {
  var courtLabel = 'cac';
  var apiRequestParams = section.getAPIRequestParams(courtLabel, '');

  apiRequestParams.searchOptions = {
    '_search': true,
    'nd': Date.now(),
    'rows': 1000,
    'page': pageNo,
    'sidx': 'data_inregistrare',
    'sord': 'asc',
    'filters': JSON.stringify({
      'groupOp': 'AND',
      'rules': [{'field': 'data_inregistrare', 'op': 'ne', 'data': '2'}]
    })
  };

  return queryAPI(apiRequestParams);
}
