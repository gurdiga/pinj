'use strict';

module.exports = getUserList;

function getUserList() {
  return time(Data.get('/data'), 'Getting user list')
  .then(prepareForSearch);
}

function prepareForSearch(users) {
  return _(users)
  .map(prepareUserData)
  .filter(not(seachedWithinTheLast(6 * 3600 * 1000)))
  .filter(nonTestUsers)
  .filter(accountForDevelopmentMode);
}

function prepareUserData(data, aid) {
  var user = {};

  user.clientList = prepareClientList(data.clients);
  user.email = emailFromAID(aid);
  user.aid = aid;
  user.lastSearch = data.timestamps.lastSearch;
  user.toString = function() {
    return user.email;
  };

  return user;
}

function not(f) {
  return function() {
    return !f.apply(this, arguments);
  };
}

function seachedWithinTheLast(time) {
  return function(user) {
    if (!user.lastSearch) return false;

    var timeSinceLastSearch = Date.now() - user.lastSearch;

    return timeSinceLastSearch < time;
  };
}

function nonTestUsers(user) {
  return user.email.indexOf('@test.com') === -1;
}

function accountForDevelopmentMode(user) {
  if (process.env.NODE_ENV === 'development') return /gurdiga.*@gmail.com/.test(user.email);
  else return true;
}

function emailFromAID(aid) {
  return aid.replace(/:/g, '.');
}

function prepareClientList(list) {
  list = list || '';

  return list.split('\n')
  .map(normalizeSpace)
  .filter(longEnough)
  .filter(uniq);

  function normalizeSpace(clientName) {
    return clientName.trim().replace(/\s+/g, ' ');
  }

  function longEnough(clientName) {
    return clientName.length >= config.CLIENT_MIN_LENGTH;
  }

  // thanks to http://stackoverflow.com/a/14438954/227167
  function uniq(v, i, a) {
    return a.indexOf(v) === i;
  }
}

var _ = require('underscore');
var Data = require('app/util/data');
var time = require('app/util/time');
var config = require('app/config');
