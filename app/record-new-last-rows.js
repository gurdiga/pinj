'use strict';

module.exports = recordNewLastRows;

function recordNewLastRows(newResultsContainer) {
  return function() {
    return getPreviousLastRows()
    .then(pluckNewLastRows(newResultsContainer))
    .then(saveNewLastRows);
  };
}

function getPreviousLastRows() {
  return Data.get('/last-ids');
}

function pluckNewLastRows(newResultsContainer) {
  return function(previousLastRows) {
    var newResults = newResultsContainer.value;

    previousLastRows.forEach(function(level) {
      level.results.forEach(function(section) {
        section.results.forEach(function(subsection) {
          subsection.results = getNewLastRow(newResults, level.label, section.label, subsection.label) || subsection.results;
        });
      });
    });

    return previousLastRows;
  };
}

function saveNewLastRows(lastRows) {
  return Data.set('/last-ids', lastRows);
}

function getNewLastRow(newResults, levelLabel, sectionLabel, subsectionLabel) {
  var level = newResults.filter(where('label', levelLabel))[0];
  if (!level) return;

  var section = level.results.filter(where('label', sectionLabel))[0];
  if (!section) return;

  var subsection = section.results.filter(where('label', subsectionLabel))[0];
  if (!subsection) return;

  return _(subsection.results).last();
}

var Data = require('util-data');
var where = require('app/util/where');
var _ = require('underscore');
