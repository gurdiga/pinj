'use strict';

module.exports = getLastIDs;

function getLastIDs() {
  var levels = [
    DistrictCourts,
    SupremeCourt
  ];

  return forEach(levels).inSeries(function(sections) {
    return forEach(sections).inParallel(function(section) {
      return forEach(section.subsectionNames).inParallel(function(subsectionName) {
        return getLastRow(section, subsectionName).then(function(data) {
          return data.rows[0].id;
        });
      });
    });
  });
}

function getLastRow(section, subsectionName) {
  return new Promise(function(resolve) {
    var url = section.getURL(subsectionName);

    var form = {
      '_search': true,
      'nd': Date.now(),
      'rows': 1,
      'page': 1,
      'sidx': 'id',
      'sord': 'desc',

      //
      // The queries for the last ID generally work without this nonsensical
      // filters definition, but werdly enough, it doesn’t for these two:
      // - Cereri în instanţă
      // - Hotărîrile instanţei:jia
      //
      // So this in essence is a hack to work around that.
      //

      'filters': JSON.stringify({
        'groupOp': 'OR',
        'rules': [
          {'field': 'id', 'op': 'gt', 'data': 1}
        ]
      })
    };

    var requestOptions = {
      uri: url,
      form: form,
      method: 'POST',
      gzip: true,
      json: true
    };

    request(requestOptions, normalizeAPIResponse(url, form, resolve));
  });
}

var request = require('request');

var normalizeAPIResponse = require('app/util/normalize-api-response');
var forEach = require('app/util/for-each');
var Promise = require('app/util/promise');

var SupremeCourt = require('app/supreme-court');
var DistrictCourts = require('app/district-courts');
