'use strict';

var _ = require('underscore');
var async = require('async');
var forEach = async.eachSeries;
var parallelize = async.parallel;
var sections = require('./meta').sections;
var queries = getQueries();

forEach(queries, function(query, callback) {
  parallelize(sectionQueries(query), printResults(query, callback));
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

function sectionQueries(query) {
  return _.chain(sections)
    .map(function(data, sectionId) {
      return [sectionId, require('./sections/' + sectionId)(query)];
    })
    .object()
    .value();
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
