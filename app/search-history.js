'use strict';

module.exports.getPreviousResults = getPreviousResults;
module.exports.recordResults = recordResults;
module.exports.recordTimestamp = recordTimestamp;
module.exports.TIMESTAMP_FORMAT = 'yyyy-mm-dd hh:MM:ss';

function getPreviousResults(aid) {
  var path = '/search-history/' + aid;

  return time(Data.getLastChildOf(path), '. Getting previous search results')
  .then(extractResultsAndTimestamp);

  function extractResultsAndTimestamp(pair) {
    var searchResults = pair.value || [];
    searchResults.timestamp = pair.key;

    return searchResults;
  }
}

function recordResults(aid, results) {
  var date = dateFormat(new Date(), module.exports.TIMESTAMP_FORMAT);
  var path = '/search-history/' + aid + '/' + date;

  return time(Data.set(path, results), '. Recording search results');
}

function recordTimestamp(aid) {
  var path = '/data/' + aid + '/timestamps/lastSearch';

  return time(Data.set(path, 'CURRENT_TIMESTAMP'), '. Storing last search timestamp');
}

var Data = require('./data');
var time = require('./util/time');
var dateFormat = require('dateformat');
