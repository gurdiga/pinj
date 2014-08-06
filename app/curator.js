'use strict';

var Curator = {};

Curator.curate = function(results) {
  return {
    'for': function curateFor(lawyerEmail) {
        time(compact)(results);
        time(disregardUnusedColumns)(results);
        time(excludeAllOldRows)(results, lawyerEmail);
        time(compact)(results);
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

          excludeOldRows(court.results, cacheKey);
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

function excludeOldRows(currentRows, cacheKey) {
  var previousRows = Storage.get(cacheKey) || [];
  var oldRowIndexes = rowsIn(currentRows).thatExistIn(previousRows);

  Storage.set(cacheKey, currentRows);
  removeItemsAt(oldRowIndexes).from(currentRows);
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

var Storage = require('./util/storage');
var _ = require('underscore');
var time = require('./util/time');

module.exports = Curator;

(function selfTest() {
  var assert = require('assert');

  (function testNullifyUnusedCells() {
    var visibleColumns = ['0', '2'];
    var row = [1, 2, 3];
    var expectedRow = [1, null, 3];

    nullifyUnusedCells(visibleColumns)(row);
    assert.deepEqual(row, expectedRow, 'Nullifies the columns that are not shown');
  }());

  (function() {
    var items = [];

    assert.deepEqual(compact(items), []);

    items = [{
      'label': 'ceva',
      'results': []
    }];
    assert.deepEqual(compact(items), []);

    items = [{
      'label': 'level11',
      'results': [
        {
          'label': 'level21',
          'results': []
        }, {
          'label': 'level22',
          'results': []
        }
      ]
    }];
    assert.deepEqual(compact(items), []);

    items = [{
      'label': 'level11',
      'results': [
        {
          'label': 'level21',
          'results': []
        }, {
          'label': 'level22',
          'results': [
            [' --- this is not empty --- ']
          ]
        }
      ]
    }];
    assert.deepEqual(compact(items), [{
      'label': 'level11',
      'results': [
        {
          'label': 'level22',
          'results': [
            [' --- this is not empty --- ']
          ]
        }
      ]
    }]);
  }());

  (function testExcludeOldRows() {
    var clientName = 'Cutărescu Ion';
    var sectionName = 'AgendaSection';

    var rowsOnDay1 = [[1], [2], [3]];
    excludeOldRows(rowsOnDay1, clientName, sectionName);
    assert.deepEqual(rowsOnDay1, [[1], [2], [3]], 'Initially do not remove any rows, since there are no old ones.');

    var rowsOnDay2 = [[1], [2], [3], [4]];
    excludeOldRows(rowsOnDay2, clientName, sectionName);
    assert.deepEqual(rowsOnDay2, [[4]], 'removes old rows');

    var rowsOnDay3 = [[1], [2], [3], [4]];
    excludeOldRows(rowsOnDay3, clientName, sectionName);
    assert.deepEqual(rowsOnDay3, [], 'empties rows when all of them are old');

    var rowsOnDay4 = [];
    excludeOldRows(rowsOnDay4, clientName, sectionName);
    assert.deepEqual(rowsOnDay4, [], 'given no rows ignore old ones');

    var rowsOnDay5 = [[5], [6]];
    excludeOldRows(rowsOnDay5, clientName, sectionName);
    assert.deepEqual(rowsOnDay5, [[5], [6]], 'leaves the new rows');
  }());

}());
