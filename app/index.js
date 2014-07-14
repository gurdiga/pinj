'use strict';

var async = require('async');
var forEach = async.eachSeries;
var parallelize = async.parallel;
var _ = require('underscore');

var readArgs = require('./read-args.js');
var queryApi = require('./query-api');
var formatResults = require('./format-results');
var agendaŞedinţelor = require('./sections/agendaŞedinţelor');


(function main() {
  var searches = readArgs();
  var queries = _(searches).keys();

  forEach(queries, function(query, callback) {
    var curteaDeApel = searches[query];

    parallelize({
      cereriÎnInstanţă: cereriÎnInstanţă(query, curteaDeApel),
      agendaŞedinţelor: agendaŞedinţelor(query),
      hotărîrileInstanţei: hotărîrileInstanţei(query),
      proceduriDeInsolvabilitate: proceduriDeInsolvabilitate(query, curteaDeApel),
      citaţiiÎnInstanţă: citaţiiÎnInstanţă(query, curteaDeApel)
    }, printResults({
      query: query,
      curteaDeApel: curteaDeApel
    }, callback));
  });

}());


function printResults(context, callback) {
  return function(err, results) {
    if (err) {
      console.error(context, formatError(err));
    } else {
      console.log(formatResults({
        'context': context,
        'results': results
      }));
    }

    callback(null);
  };
}

function formatError(err) {
  return err;
}

function cereriÎnInstanţă(query) {
  var url = 'http://instante.justice.md/apps/cereri_pendinte/cereri_grid.php';
  var searchOptions = {
    'sidx': 'site_name desc, site_name',
    'sord': 'desc',
    'filters': JSON.stringify({
      'groupOp': 'AND',
      'rules': [
        {'field': 'parti_dosar', 'op': 'cn', 'data': query}
      ]
    })
  };

  return function(callback) {
    queryApi(url, searchOptions, callback);
  };
}

function hotărîrileInstanţei(query) {
  var url = 'http://instante.justice.md/apps/hotariri_judecata/inst/cac/db_hot_grid.php';
  var searchOptions = {
    'sidx': 'id',
    'sord': 'asc',
    'filters': JSON.stringify({
      'groupOp': 'AND',
      'rules': [
        {'field': 'denumire_dosar', 'op': 'cn', 'data': query}
      ]
    })
  };

  return function(callback) {
    queryApi(url, searchOptions, callback);
  };
}

function proceduriDeInsolvabilitate(query) {
  var url = 'http://instante.justice.md/apps/hotariri_judecata/inst/cac/db_hot_grid-i.php';
  var searchOptions = {
    'sidx': 'id',
    'sord': 'asc',
    'filters': JSON.stringify({
      'groupOp': 'AND',
      'rules': [
        {'field': 'denumire_dosar', 'op': 'cn', 'data': query}
      ]
    })
  };

  return function(callback) {
    queryApi(url, searchOptions, callback);
  };
}

function citaţiiÎnInstanţă(query) {
  var url = 'http://instante.justice.md/apps/citatii_judecata/citatii_grid.php';
  var searchOptions = {
    'sidx': 'judecatoria_vizata desc, judecatoria_vizata',
    'sord': 'desc',
    'filters': JSON.stringify({
      'groupOp': 'OR',
      'rules': [
        {'field': 'reclamantul', 'op': 'cn', 'data': query},
        {'field': 'persoana_citata', 'op': 'cn', 'data': query}
      ]
    })
  };

  return function(callback) {
    queryApi(url, searchOptions, callback);
  };
}
