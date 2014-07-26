'use strict';

var AgendaSection = require('./sections/agenda-section');
var CaseInquirySection = require('./sections/case-inquiry-section');
var SummonsSection = require('./sections/summons-section');
var SentenceSection = require('./sections/sentence-section');

var Inquirer = {};

var sections = [
  AgendaSection,
  CaseInquirySection,
  SummonsSection,
  SentenceSection
];

Inquirer.inquireAbout = function(clientNames) {
  var forEach = require('./utils/for-each');

  return forEach(clientNames)
    .inSeries(function(clientName) {
      return forEach(sections).inParallel(function(section) {
        return section.inquireAbout(clientName);
      });
    })
    .then(excludeAllOldRows);
};

function excludeAllOldRows(results) {
  var _ = require('underscore');

  _(results).each(function(sections, clientName) {
    _(sections).each(function(rows, sectionName) {
      excludeOldRows(rows, clientName, sectionName);
    });
  });

  return results;
}

function excludeOldRows(currentRows, clientName, sectionName) {
  var cacheKey = clientName + sectionName;
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

var Storage = require('./storage');

module.exports = Inquirer;

(function selfTest() {
  var assert = require('assert');

  var clientName = 'Cutărescu Ion';
  var sectionName = AgendaSection.toString();

  Storage.clear();

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
