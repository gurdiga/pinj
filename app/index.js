'use strict';

var _ = require('underscore');
var async = require('async');
var taskList = require('./task-list');
var input = require('../input');

_(input).each(function(queries, email) {
  var globalQueries = prepareGlobalQueries(queries);
  async.series(globalQueries, sendResultsTo(email));
});


function prepareGlobalQueries(queries) {
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
    return require('./sections/' + sectionId).query(query);
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

function sendResultsTo(email) {
  return function(err, results) {
    var sendEmail = require('./send-email');
    var formatResults = require('./format-results');

    if (err) {
      console.error('sendResultsTo error:', err);
    } else {
      var htmlContent = formatResults({'results': results});
      sendEmail(email, htmlContent);
    }
  };
}
