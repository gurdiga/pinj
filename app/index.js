'use strict';

var async = require('async');
var forEach = async.eachSeries;
var parallelize = async.parallel;
var queries = getQueries();

forEach(queries, function(query, callback) {
  parallelize({
    cereriÎnInstanţă: require('./sections/cereriÎnInstanţă')(query),
    agendaŞedinţelor: require('./sections/agendaŞedinţelor')(query),
    hotărîrileInstanţei: require('./sections/hotărîrileInstanţei')(query),
    citaţiiÎnInstanţă: require('./sections/citaţiiÎnInstanţă')(query)
  }, printResults(query, callback));
});


function getQueries() {
  var args = process.argv.slice(2);

  if (args.length === 0) {
    showUsageAndExit();
    process.exit(1);
    return;
  }

  return args;
}

function showUsageAndExit() {
  console.log(
    'Usage:\n' +
    '\n' +
    '  ' + process.argv[1] + ' "text de căutat:curtea de apel" ...' +
    '\n'
  );
}

function printResults(query, callback) {
  var formatResults = require('./format-results');

  return function(err, results) {
    if (err) {
      console.error(query, err);
    } else {
      console.log(formatResults({
        'query': query,
        'results': results
      }));
    }

    callback(null);
  };
}
