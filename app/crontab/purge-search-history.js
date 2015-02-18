'use strict';

function main() {
  return getUserList()
  .then(purgeSearchHistory)
  .then(disconnectFirebase)
  .catch(logErrorAndExit);
}

function purgeSearchHistory(users) {
  console.log('. purging search history');

  return forEach(users).inSeries(purgeSearchHistoryForUser);
}

function purgeSearchHistoryForUser(user) {
  var path = '/search-history/' + user.aid;

  return Data.get(path)
  .then(function(results) {
    var resultTimestamps = _(results).keys();
    var oldResultTimestamps = _.initial(resultTimestamps, config.MAX_HISTORY_LENGTH);

    return time(forEach(oldResultTimestamps).inSeries(function(timestamp) {
      return Data.set(path + '/' + timestamp, null);
    }), '.. ' + user.email);
  });
}

function disconnectFirebase() {
  // Prevent Firebase from hanging node.
  process.exit();
}

function logErrorAndExit(error) {
  console.error(error.stack);
  process.exit(1);
}

var _ = require('underscore');
var getUserList = require('app/get-user-lists');
var Data = require('app/util/data');
var forEach = require('app/util/for-each');
var time = require('app/util/time');
var config = require('app/config');

main();
