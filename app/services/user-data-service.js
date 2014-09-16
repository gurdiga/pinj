(function() {
  'use strict';

  var TIMEOUT = 3000;
  var DATA_ROOT = '/data';

  function UserDataService(email) {
    this.email = email;
  }

  UserDataService.prototype.set = function(path, value) {
    var deferred = new Deferred();
    var fullPath = getFullPathFor(path, this.email);

    this.getRef().child(fullPath)
    .set(value, function onComplete(error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });

    deferred.timeout(TIMEOUT, 'Timed out while writing data: ' + path);

    return deferred.promise;
  };

  UserDataService.prototype.get = function(path) {
    var deferred = new Deferred();
    var fullPath = getFullPathFor(path, this.email);

    this.getRef().child(fullPath)
    .once('value', function successCallback(snapshot) {
      deferred.resolve(snapshot.val());
    });

    deferred.timeout(TIMEOUT, 'Timed out while reading data: ' + path);

    return deferred.promise;
  };

  UserDataService.prototype.getRef = function() {
    if (!this.ref) this.ref = new Firebase(App.FIREBASE_URL);

    return this.ref;
  };

  function getFullPathFor(relativePath, email) {
    /*jshint validthis:true*/
    return DATA_ROOT + '/' + aid(email) + '/' + relativePath;
  }

  function aid(email) {
    return email.replace(/\./g, ':');
  }

  window.UserDataService = UserDataService;

}());
