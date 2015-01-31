'use strict';

module.exports = recordNewLastIDs;

function recordNewLastIDs(newResultsContainer) {
  return function() {
    return getPreviousLastIDs()
    .then(pluckNewLastIDs(newResultsContainer))
    .then(saveNewLastIDs);
  };
}

function getPreviousLastIDs() {
  return Data.get('/last-ids');
}

function pluckNewLastIDs(newResultsContainer) {
  return function(previousLastIDs) {
    var newResults = newResultsContainer.value;

    previousLastIDs.forEach(function(level) {
      level.results.forEach(function(section) {
        section.results.forEach(function(subsection) {
          subsection.results = getNewLastID(newResults, level.label, section.label, subsection.label) || subsection.results;
        });
      });
    });

    return previousLastIDs;
  };
}

function saveNewLastIDs(lastIDs) {
  return Data.set('/last-ids', lastIDs);
}

function getNewLastID(newResults, levelLabel, sectionLabel, subsectionLabel) {
  var level = newResults.filter(havingLabel(levelLabel))[0];
  if (!level) return;

  var section = level.results.filter(havingLabel(sectionLabel))[0];
  if (!section) return;

  var subsection = section.results.filter(havingLabel(subsectionLabel))[0];
  if (!subsection) return;

  return subsection.results.lastID;

  function havingLabel(label) {
    return function(item) {
      return item.label === label;
    };
  }
}

var Data = require('app/util/data');
