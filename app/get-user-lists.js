'use strict';

module.exports = getUserList;

function getUserList() {
  return time(Data.get('/data'), 'Getting user data')
  .then(prepareForSearch);
}

function prepareForSearch(users) {
  return _(users)
  .map(prepareUserData)
  .filter(accountForDevelopmentMode);
}

function prepareUserData(data, aid) {
  var user = {};

  user.clientList = prepareClientList(data.clients);
  user.email = emailFromAID(aid);
  user.aid = aid;
  user.toString = function() {
    return user.email;
  };

  if (isTrial(data.timestamps.registration)) user.isTrial = true;
  else if (isPayer(data.timestamps.lastPayment)) user.isPayer = true;

  return user;
}

function accountForDevelopmentMode(user) {
  if (process.env.NODE_ENV === 'development') return user.email === 'gurdiga@gmail.com';
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
  .filter(respectsMinLength(5));

  function normalizeSpace(clientName) {
    return clientName.trim().replace(/\s+/g, ' ');
  }

  function respectsMinLength(minLength) {
    return function(clientName) {
      return clientName.length > minLength;
    };
  }
}

var _ = require('underscore');
var Data = require('./data');
var time = require('./util/time');
