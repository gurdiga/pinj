'use strict';

var Curator = {};

Curator.curate = function(results) {
  return {
    'for': function curateFor(lawyerEmail) {
        compact(results);
        disregardUnusedColumns(results);
        excludeAllOldRows(results, lawyerEmail);
        compact(results);
        stopIfNoNews(results);

        return results;
    }
  };
};

function disregardUnusedColumns(results) {
  results.forEach(function(client) {
    client.results.forEach(function(level) {
      level.results.forEach(function(section) {
        var visibleColumns = getVisibleColumns(section.results.columns);
        section.results.forEach(function(court) {
          court.results.forEach(nullifyUnusedCells(visibleColumns));
        });
      });
    });
  });

  return results;
}

function nullifyUnusedCells(visibleColumns) {
  return function(row) {
    _.chain(row)
      .omit(visibleColumns)
      .each(function(v, i) {
        row[i] = null;
      });
  };
}

function getVisibleColumns(columns) {
  return columns
    .filter(function(column) {
      return column.show;
    })
    .map(function(column) {
      return column.index.toString();
    });
}

function excludeAllOldRows(results, lawyerEmail) {
  results.forEach(function(client) {
    client.results.forEach(function(level) {
      level.results.forEach(function(section) {
        section.results.forEach(function(court) {
          var cacheKey = [
            lawyerEmail,
            client.label,
            level.label,
            section.label,
            court.label
          ].join(' ');

          excludeOldRows(court.results, cacheKey, lawyerEmail, client.label);
        });
      });
    });
  });

  return results;
}

function compact(items) {
  var emptyItems = [];

  items.forEach(function(item, i) {
    if (!('results' in item)) return;
    if (item.results.length > 0) compact(item.results);
    if (item.results.length === 0) emptyItems.push(i);
  });

  emptyItems.reverse().forEach(function(i) {
    items.splice(i, 1);
  });

  return items;
}

function stopIfNoNews(results) {
  if (results.length === 0) throw new Error('No news');
}

function excludeOldRows(currentRows, cacheKey, lawyerEmail, client) {
  var previousRows = Storage.get(cacheKey) || [];
  var oldRowIndexes = rowsIn(currentRows).thatExistIn(previousRows);

  Storage.set(cacheKey, currentRows);
  alsoStoreInFirebase(currentRows, lawyerEmail, client);
  removeItemsAt(oldRowIndexes).from(currentRows);
}

function alsoStoreInFirebase(currentRows, lawyerEmail, client) {
  if (process.env.NODE_ENV === 'development') return Q.delay(0);

  var aid = lawyerEmail.replace(/\./g, ':');
  var escapedClient = client.replace(/[.#$[\]]/g, '_');

  Data.set('/search-history/' + aid + '/' + escapedClient, JSON.stringify(currentRows))
  .catch(function(error) {
    console.log('Can’t save search results to Firebase:', error);
    throw error;
  });
}

function removeItemsAt(indexes) {
  return {
    from: function(array) {
      indexes.reverse().forEach(function(index) {
        array.splice(index, 1);
      });
    }
  };
}

function rowsIn(firstArray) {
  return {
    thatExistIn: function(secondArray) {
      firstArray = stringify(firstArray);
      secondArray = stringify(secondArray);

      return firstArray.reduce(function(indexes, row, i) {
        if (secondArray.indexOf(row) > -1) indexes.push(i);
        return indexes;
      }, []);
    }
  };
}

function stringify(array) {
  return array.map(function(item) {
    return JSON.stringify(item);
  });
}

module.exports = Curator;

var Storage = require('./util/storage');
var Data = require('./data');
var _ = require('underscore');
var Q = require('q');
Q.longStackSupport = true;
