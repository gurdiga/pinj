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

  return news;
}

function getNews(searchResults, client, level, section, court) {
  var previousSectionRows = getPreviousCourtRows(searchResults, client.label, level.label, section.label, court.label);
  var currentSectionRows = court.results;

  return _(currentSectionRows).difference(previousSectionRows);
}

function getPreviousCourtRows(searchResults, clientLabel, levelLabel, sectionLabel, courtLabel) {
  var rowSets = jsonPath.eval(searchResults.previous, '$' +
    '[?(@.label=="' + clientLabel   + '")].results' +
    '[?(@.label=="' + levelLabel    + '")].results' +
    '[?(@.label=="' + sectionLabel  + '")].results' +
    '[?(@.label=="' + courtLabel    + '")].results'
  );

  return rowSets.reduce(function(allRows, rowSet) {
    return allRows.concat(rowSet);
  }, []);
}

function preparePath(news, steps) {
  var cursor = news;

  steps.forEach(function(step) {
    var doesNotExist = _.isEmpty(jsonPath.eval(cursor, '$[?(@.label=="' + step + '")]'));

    if (doesNotExist) {
      cursor.push({
        'label': step,
        'results': []
      });
    }

    cursor = cursor[cursor.length-1].results;
  });

  return cursor;
}

var _ = require('underscore');
var jsonPath = require('JSONPath');
