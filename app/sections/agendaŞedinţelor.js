'use strict';

var queryApi = require('../query-api');
var instanţe = require('../instanţe');
var _ = require('underscore');
var serialize = require('async').series;

module.exports = function agendaŞedinţelor(query) {
  var searchOptions = prepareSearchOptions(query);
  var calls = prepareCalls(searchOptions);

  return function(callback) {
    serialize(calls, passResultsTo(callback, query));
  };
};


function prepareSearchOptions(query) {
  return {
    'sidx': 'data_inregistrare asc, data_inregistrare',
    'sord': 'asc',
    'filters': JSON.stringify({
      'groupOp': 'AND',
      'rules': [
        {'field': 'denumire_dosar', 'op': 'cn', 'data': query}
      ]
    })
  };
}

function prepareCalls(searchOptions) {
  var exceptions = ['jslb']; // agenda pare să nu fie implementată pentru Slobozia http://instante.justice.md/cms/curtea-de-apel-bender/jslb-menu

  return _.chain(instanţe)
    .omit(exceptions)
    .map(function(denumire, id) {
      return [id, function(callback) {
        var url = 'http://instante.justice.md/apps/agenda_judecata/inst/' + id + '/agenda_grid.php';
        queryApi(url, searchOptions, callback);
      }];
    })
    .object()
    .value();
}

function passResultsTo(callback, query) {
  return function(err, results) {
    var rows = [];
    var errors = [];

    if (err) {
      console.error('agendaŞedinţelor', query, err);
    } else {
      _(results).each(function(result, id) {
        if (_(result).isObject()) {
          if (result.rows) rows = rows.concat(result.rows);
        } else {
          console.error(id, result);
          errors.push(instanţe[id]);
        }
      });
    }

    callback(null, {
      rows: rows,
      errors: errors
    });
  };
}
