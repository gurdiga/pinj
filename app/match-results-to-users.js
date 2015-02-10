'use strict';

module.exports = matchResultsToUsers;

function matchResultsToUsers(data) {
  var userList = data[0];
  var newRows = data[1];

  var matchingRows = [];

  newRows.forEach(function(level) {
    level.results.forEach(function(section) {
      section.results.forEach(function(subsection) {
        subsection.results.forEach(function(row) {
          userList.forEach(function(user) {
            user.clientList.forEach(function(clientName) {
              if (!rowMatches(subsection.section, row, clientName)) return;

              var path = preparePath(matchingRows, [user.email, clientName, level.label, section.label, subsection.label]);
              path.push(row);
            });
          });
        });
      });
    });
  });

  return matchingRows;
}

function rowMatches(section, row, query) {
  var queryType = getQueryType(query);

  return section.columns.some(function(column) {
    if (!column.searchable) return false;
    if (column.queryType !== queryType) return false;
    return row[column.index].indexOf(query) > -1;
  });
}

function preparePath(news, labels) {
  return labels.reduce(function(items, label) {
    var existingItem = items.filter(where('label', label))[0];

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

var getQueryType = require('app/util/get-query-type');
var where = require('app/util/where');
