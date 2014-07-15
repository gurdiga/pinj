'use strict';

var _ = require('underscore');
var async = require('async');
var taskList = require('./task-list');

var globalQueries = prepareGlobalQueries();
async.series(globalQueries, printResults);


function prepareGlobalQueries() {
  var queries = process.argv.slice(2);

  if (queries.length === 0) showUsageAndExit();

  return taskList(queries, doSectionQueries);
}

function doSectionQueries(query) {
  return function(callback) {
    var sectionQueries = prepareSectionQueries(query);
    async.parallel(sectionQueries, callback);
  };
}

function prepareSectionQueries(query) {
  var sections = require('./meta').sections;
  var sectionIds = _(sections).keys();

  return taskList(sectionIds, doSectionQuery(query));
}

function doSectionQuery(query) {
  return function(sectionId) {
    return require('./sections/' + sectionId)(query);
  };
}

function showUsageAndExit() {
  console.log(
    'Usage:\n' +
    '\n' +
    '  ' + process.argv[1] + ' "text de căutat:curtea de apel" ...' +
    '\n'
  );
  process.exit(1);
}

function printResults(err, results) {
  var formatResults = require('./format-results');

  if (err) {
    console.error('printResults error:', err);
  } else {
    console.log(formatResults({ 'results': results }));
  }
}
