'use strict';

module.exports.getPreviousResults = getPreviousResults;
module.exports.add = add;
module.exports.TIMESTAMP_FORMAT = 'yyyy-mm-dd hh:MM:ss';

function getPreviousResults(aid) {
  var path = '/search-history/' + aid;

  return time(Data.getLastChildOf(path), '. Getting previous search results')
  .then(defaultTo({}));

  function defaultTo(value) {
    return function(searchResults) {
      return searchResults || value;
    };
  }
}

function add(aid, results) {
  var date = dateFormat(new Date(), module.exports.TIMESTAMP_FORMAT);
  var path = '/search-history/' + aid + '/' + date;

  return time(Data.set(path, results), '. Storing new search results');
}

var Data = require('./data');
var time = require('./util/time');
var dateFormat = require('dateformat');
