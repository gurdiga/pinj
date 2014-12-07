'use strict';

var Data = {};

Data.get = function(path) {
  return authenticate.then(function() {
    return Q.Promise(function(resolve, reject) {
      ref.child(path).once('value', onSuccess, onCancel);

      function onSuccess(snapshot) {
        resolve(snapshot.val());
      }

      function onCancel(error) {
        reject(error);
      }
    });
  });
};

Data.set = function(path, value) {
  return authenticate.then(function() {
    return Q.Promise(function(resolve, reject) {
      ref.child(path).set(value, onComplete);

      function onComplete(error) {
        if (error) reject(error);
        else resolve();
      }
    });
  });
};

var authenticate;
var ref;

function main() {
  ref = new Firebase('https://pinj-dev.firebaseio.com');
  authenticate = Q.Promise(function(resolve, reject) {
    var tokenGenerator = new FirebaseTokenGenerator(secrets.PINJ_FIREBASE_SECRET);
    var token = tokenGenerator.createToken({
      isSearchEngine: true
    });

    ref.auth(token, onAuthComplete, onAuthCanceled);

    function onAuthComplete(err) {
      if (err) reject(err);
      else resolve();
    }

    function onAuthCanceled(err) {
      reject(err);
    }
  });
}

module.exports = Data;

var Q = require('q');
var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var secrets = require('../secrets');
main();
