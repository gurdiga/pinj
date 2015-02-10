'use strict';

module.exports = getUsers;

function getUsers() {
  return time('. getting user list', Data.get('/data'))
  .then(prepareForSearch);
}

function prepareForSearch(users) {
  console.log('.. %s users', _.size(users));

  return _(users)
  .map(prepareUserData)
  .filter(notYetServed)
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

  if (isTrial(data.timestamps.registration)) user.isTrial = true;
  else if (isPayer(data.timestamps.lastPayment)) user.isPayer = true;

  return user;
}

function notYetServed(user) {
  if (!user.lastSearch) return true;

  return Date.now() - user.lastSearch > config.TIME_BEFORE_THE_COVER_RUN;
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

function isTrial(registrationTimestamp) {
  registrationTimestamp = registrationTimestamp || 0;
  return Date.now() - registrationTimestamp < config.TRIAL_PERIOD;
}

function isPayer(lastPaymentTimestamp) {
  lastPaymentTimestamp = lastPaymentTimestamp || 0;
  return Date.now() - lastPaymentTimestamp < config.SUBSCRIPTION_PERIOD + config.GRACE_PERIOD;
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
var Data = require('util-data');
var time = require('app/util/time');
var config = require('pinj-config');
