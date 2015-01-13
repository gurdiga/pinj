'use strict';

module.exports = findNews;

function findNews(searchResults) {
  var news = [];

  searchResults.current.forEach(function(client) {
    client.results.forEach(function(level) {
      level.results.forEach(function(section) {
        section.results.forEach(function(court) {
          var newRows = getNews(searchResults, client, level, section, court);
          if (_.isEmpty(newRows)) return;

          var path = preparePath(news, [client.label, level.label, section.label, court.label]);
          newRows.forEach(function(row) {
            path.push(row);
          });
        });
      });
    });
  });

  if (_.isEmpty(news)) throw new Error('No news');
  else return news;
}

function getNews(searchResults, client, level, section, court) {
  var previousSectionRows = getPreviousCourtRows(searchResults, client.label, level.label, section.label, court.label);
  var currentSectionRows = court.results;

  return _(currentSectionRows).difference(previousSectionRows);
}

function getPreviousCourtRows(searchResults, clientLabel, levelLabel, sectionLabel, courtLabel) {
  return searchResults.previous
  .filter(havingLabel(clientLabel )).reduce(collectResults, [])
  .filter(havingLabel(levelLabel  )).reduce(collectResults, [])
  .filter(havingLabel(sectionLabel)).reduce(collectResults, [])
  .filter(havingLabel(courtLabel  )).reduce(collectResults, []);

  function collectResults(collectedResults, item) {
    return collectedResults.concat(item.results);
  }
}

function preparePath(news, labels) {
  return labels.reduce(function(items, label) {
    var existingItem = items.filter(havingLabel(label))[0];

    if (existingItem) return existingItem.results;
    else return appendNewEmptyItem(items, label).results;
  }, news);

  function appendNewEmptyItem(items, label) {
    var newItem = {
      'label': label,
      'results': []
    };

    items.push(newItem);
    return newItem;
  }
}

function havingLabel(label) {
  return function(item) {
    return item.label === label;
  };
}

var _ = require('underscore');
