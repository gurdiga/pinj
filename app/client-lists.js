'use strict';

var ClientLists = {};

ClientLists.get = function() {
  return time(getFirebaseData('/data'), 'getting client lists')
  .then(selectPayersAndTrials);
};

function selectPayersAndTrials(users) {
  var payersAndTrials = [];

  _(users).each(function(data, aid) {
    var email = emailFromAID(aid);

    if (isTrialOrPayer(data)) payersAndTrials.push({
      'email': email,
      'clientList': prepareClientList(data.clients),
      'toString': function() { return email; }
    });
  });

  return payersAndTrials;

  function isTrialOrPayer(data) {
    var lastPayment = data.timestamps.lastPayment || 0;
    var registration = data.timestamps.registration || 0;

    var SUBSCRIPTION_PERIOD = 31 * 24 * 3600 * 1000;
    var GRACE_PERIOD = 7 * 24 * 3600 * 1000;
    var TRIAL_PERIOD = 31 * 24 * 3600 * 1000;

    var isPayer = Date.now() - lastPayment < SUBSCRIPTION_PERIOD + GRACE_PERIOD;
    var isTrial = Date.now() - registration < TRIAL_PERIOD;

    return isPayer || isTrial;
  }

  function emailFromAID(aid) {
    return aid.replace(/:/g, '.');
  }

  function prepareClientList(list) {
    list = list || '';

    return list.split('\n')
    .map(normalizeSpace)
    .map(removeBadCharacters)
    .filter(respectsMinLength(5));

    function normalizeSpace(clientName) {
      return clientName.trim().replace(/\s+/g, ' ');
    }

    function removeBadCharacters(clientName) {
      return clientName.replace(/[^-# 0-9a-zа-яăîşţâ\.]/i, '');
    }

    function respectsMinLength(minLength) {
      return function(clientName) {
        return clientName.length > minLength;
      };
    }
  }
}

function getFirebaseData(path) {
  var FIREBASE_URL = 'https://pinj-dev.firebaseio.com';
  var ref = new Firebase(FIREBASE_URL);

  return authenticate(ref)
  .then(function() {
    var deferred = Q.defer();

    ref.child(path)
    .on('value', onSuccess, onCancel);

    function onSuccess(snapshot) {
      deferred.resolve(snapshot.val());
    }

    function onCancel(error) {
      deferred.reject(error);
    }

    return deferred.promise;
  });
}

function authenticate(ref) {
  var deferred = Q.defer();
  var tokenGenerator = new FirebaseTokenGenerator(secrets.PINJ_FIREBASE_SECRET);
  var token = tokenGenerator.createToken({
    cron: true
  });

  ref.auth(token, onAuthComplete, onAuthCanceled);

  function onAuthComplete(err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
    }
  }

  function onAuthCanceled(err) {
    deferred.reject(err);
  }

  return deferred.promise;
}

module.exports = ClientLists;

var Q = require('q');
var _ = require('underscore');
var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var secrets = require('../secrets');
var time = require('./util/time');
