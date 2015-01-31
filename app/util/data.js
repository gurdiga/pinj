'use strict';

module.exports.get = get;
module.exports.set = set;
module.exports.getLastChildOf = getLastChildOf;

function get(path) {
  return authenticated(function(resolve, reject) {
    ref.child(path).once('value', onSuccess, onCancel);

    function onSuccess(snapshot) {
      resolve(snapshot.val());
    }

    function onCancel(error) {
      reject(error);
    }
  });
}

function set(path, value) {
  if (value === 'CURRENT_TIMESTAMP') value = Firebase.ServerValue.TIMESTAMP;

  return authenticated(function(resolve, reject) {
    ref.child(path).set(value, onComplete);

    function onComplete(error) {
      if (!error) resolve();
      else reject(error);
    }
  });
}

function getLastChildOf(path) {
  return authenticated(function(resolve, reject) {
    ref.child(path).limitToLast(1).once('value', onSuccess, onCancel);

    function onSuccess(snapshot) {
      var pair = snapshot.val();

      if (!pair) return resolve({});

      var key = Object.keys(pair)[0];
      var value = pair[key];

      resolve({
        'key': key,
        'value': value
      });
    }

    function onCancel(error) {
      reject(error);
    }
  });
}

function authenticated(f) {
  return authenticate.then(function() {
    return new Promise(f);
  });
}

var authenticate;
var ref;

function main() {
  ref = new Firebase('https://pinj-dev.firebaseio.com');

  authenticate = new Promise(function(resolve, reject) {
    var tokenGenerator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);
    var token = tokenGenerator.createToken({
      uid: '1',
      isSearchEngine: true
    });

    ref.authWithCustomToken(token, onComplete);

    function onComplete(error) {
      if (!error) resolve();
      else reject(error);
    }
  });
}

var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var Promise = require('app/util/promise');
main();
