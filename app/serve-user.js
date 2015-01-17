'use strict';

module.exports = serveUser;

function serveUser(user) {
  var searchResultSets = {};

  return SearchHistory.getPreviousResults(user.aid)
  .then(collectIn(searchResultSets, 'previous'))
  .then(getCurrentSearchResults(user.clientList))
  .then(collectIn(searchResultSets, 'current'))
  .then(findNews)
  .then(assertNotEmptyNews)
  .then(prepareEmailBodies)
  .then(sendEmail(user.email, 'Monitorul PINJ: informaţii despre clienţi'))
  .then(recordCurrentSearchResults(user.aid, searchResultSets))
  .catch(handleErrors)
  .then(recordLastSearchTimestamp(user.aid));
}

function collectIn(container, key) {
  return function(value) {
    container[key] = value;
    return container;
  };
}

function recordCurrentSearchResults(aid, searchResultSets) {
  return function() {
    return SearchHistory.recordResults(aid, searchResultSets.current);
  };
}

function recordLastSearchTimestamp(aid) {
  return function() {
    return SearchHistory.recordTimestamp(aid);
  };
}

function assertNotEmptyNews(news) {
  if (news.length === 0) throw new Error('No news');
  else return news;
}

function handleErrors(error) {
  if (error.message === 'No news') console.log(error.message);
  else throw error;
}

var SearchHistory = require('app/search-history');
var getCurrentSearchResults = require('app/get-current-search-results');
var findNews = require('app/find-news');
var prepareEmailBodies = require('app/prepare-news-email-bodies');
var sendEmail = require('app/util/send-email');
