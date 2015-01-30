'use strict';

module.exports = findMatchingRowsForEachUser;

function findMatchingRowsForEachUser(data) {
  var userList = data[0];
  var newRows = data[1];

  console.log('userList', JSON.stringify(userList, null, '  '));
  console.log('newRows', JSON.stringify(newRows, null, '  '));

  var matchingRows = [];

  newRows.forEach(function(level) {
    level.results.forEach(function(section) {
      section.results.forEach(function(subsection) {
        subsection.results.forEach(function(row) {
          userList.forEach(function(user) {
            user.clientList(function(clientName) {
              var path = preparePath(matchingRows, [level.label, section.label, subsection.label]);
              if (rowMatches(section.label, row, clientName)) path.push(row);
            });
          });
        });
      });
    });
  });

  console.log('matchingRows', matchingRows);
  process.exit();

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

  function havingLabel(label) {
    return function(item) {
      return item.label === label;
    };
  }
}

var getQueryType = require('app/util/get-query-type');
