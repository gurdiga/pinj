'use strict';

var ClientLists = {};

ClientLists.getFor = function(payerEmails) {
  return getFirebaseData('/data')
  .then(pickByEmail(payerEmails));

  function pickByEmail(payerEmails) {
    var payerAIDs = payerEmails.map(aidFromEmail);

    return function(users) {
      var payerClientLists = [];

      console.log('users:', users);

      _(users).each(function(data, aid) {
        if (isPayer(aid)) payerClientLists.push({
          email: emailFromAID(aid),
          clientList: prepare(data.clients),
          toString: function() {
            return emailFromAID(aid);
          }
        });
      });

      console.log('payerClientLists:', payerClientLists);

      return payerClientLists;
    };

    function isPayer(aid) {
      return payerAIDs.indexOf(aid) > -1;
    }

    function aidFromEmail(email) {
      return email.replace(/\./g, ':');
    }

    function emailFromAID(aid) {
      return aid.replace(/:/g, '.');
    }

    function prepare(list) {
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
          return clientName.trim().length > minLength;
        };
      }
    }
  }
};

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
