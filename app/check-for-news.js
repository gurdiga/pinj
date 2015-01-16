'use strict';

module.exports = checkForNews;

function checkForNews(user) {
  return first(
    getPreviousSearchResults(user.aid),
    getCurrentSearchResults(user.clientList)
  )
  .then(sendNewsTo(user))
  .then(recordSearchResults(user.aid))
  .then(recordSearchTimestamp(user.aid))
  .catch(handleErrors);
}

function first(promise1, promise2) {
  return Q.allSettled([promise1, promise2])
  .spread(function(response1, response2) {
    if (response1.state === 'rejected') throw response1.reason;
    if (response2.state === 'rejected') throw response2.reason;

    var searchResults = {
      previous: response1.value,
      current: response2.value
    };

    return searchResults;
  });
}

function sendNewsTo(user) {
  return function(searchResults) {
    return new Q(findNews(searchResults))
    .then(prepareEmailBodies)
    .then(sendEmail(user.email, 'Monitorul PINJ: informaţii despre clienţi'))
    .then(forward(searchResults.current));
  };
}

function handleErrors(error) {
  if (error.message === 'No news') console.log(error.message);
  else throw error;
}

function forward(data) {
  return function() {
    return data;
  };
}

function recordSearchResults(aid) {
  return function(results) {
    return SearchHistory.recordResults(aid, results);
  };
}

function recordSearchTimestamp(aid) {
  return function() {
    return SearchHistory.recordTimestamp(aid);
  };
}

var Q = require('q');
var SearchHistory = require('app/search-history');
var getPreviousSearchResults = SearchHistory.getPreviousResults;
var getCurrentSearchResults = require('app/get-current-search-results');
var findNews = require('app/find-news');
var prepareEmailBodies = require('app/prepare-news-email-bodies');
var sendEmail = require('app/util/send-email');
