'use strict';

module.exports = getUserList;

function getUserList() {
  return time(Data.get('/data'), 'Getting user list')
  .then(prepareForSearch)
  .then(checkIfThereIsAnythingToSearch);
}

function prepareForSearch(users) {
  return _(users)
  .map(prepareUserData)
  .filter(notYetServed)
  .filter(accountForDevelopmentMode);
}

function checkIfThereIsAnythingToSearch(users) {
  if (users.length === 0) console.log('. all users have already been served today');
  return users;
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
  if (process.env.NODE_ENV === 'import') return true;
  if (!user.lastSearch) return true;

  var TIME_BETWEEN_THE_SECOND_RUN = 3600 * 1000;
  return Date.now() - user.lastSearch > TIME_BETWEEN_THE_SECOND_RUN;
}

function accountForDevelopmentMode(user) {
  if (process.env.NODE_ENV === 'development') return /gurdiga.*@gmail.com/.test(user.email);
  else return true;
}

function emailFromAID(aid) {
  return aid.replace(/:/g, '.');
}

function isTrial(registrationTimestamp) {
  var TRIAL_PERIOD = 31 * 24 * 3600 * 1000;

  registrationTimestamp = registrationTimestamp || 0;
  return Date.now() - registrationTimestamp < TRIAL_PERIOD;
}

function isPayer(lastPaymentTimestamp) {
  var SUBSCRIPTION_PERIOD = 31 * 24 * 3600 * 1000;
  var GRACE_PERIOD = 7 * 24 * 3600 * 1000;

  lastPaymentTimestamp = lastPaymentTimestamp || 0;
  return Date.now() - lastPaymentTimestamp < SUBSCRIPTION_PERIOD + GRACE_PERIOD;
}

function prepareClientList(list) {
  list = list || '';

  return list.split('\n')
  .map(normalizeSpace)
  .filter(respectsMinLength(5))
  .filter(uniq);

  function normalizeSpace(clientName) {
    return clientName.trim().replace(/\s+/g, ' ');
  }

  function respectsMinLength(minLength) {
    return function(clientName) {
      return clientName.length > minLength;
    };
  }

  // thanks to http://stackoverflow.com/a/14438954/227167
  function uniq(v, i, a) {
    return a.indexOf(v) === i;
  }
}

var _ = require('underscore');
var Data = require('app/util/data');
var time = require('app/util/time');
