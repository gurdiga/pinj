'use strict';

var async = require('async');
var forEach = async.eachSeries;
var parallelize = async.parallel;
var _ = require('underscore');

var readArgs = require('./read-args.js');
var formatResults = require('./format-results');


(function main() {
  var searches = readArgs();
  var queries = _(searches).keys();

  forEach(queries, function(query, callback) {
    var curteaDeApel = searches[query];

    parallelize({
      cereriÎnInstanţă: require('./sections/cereriÎnInstanţă')(query),
      agendaŞedinţelor: require('./sections/agendaŞedinţelor')(query),
      hotărîrileInstanţei: require('./sections/hotărîrileInstanţei')(query),
      citaţiiÎnInstanţă: require('./sections/citaţiiÎnInstanţă')(query)
    }, printResults({
      query: query,
      curteaDeApel: curteaDeApel
    }, callback));
  });

}());


function printResults(context, callback) {
  return function(err, results) {
    if (err) {
      console.error(context, err);
    } else {
      console.log(formatResults({
        'context': context,
        'results': results
      }));
    }

    callback(null);
  };
}
