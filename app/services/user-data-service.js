(function() {
  'use strict';

  var TIMEOUT = 3000;
  var DATA_ROOT = '/data';

  function UserDataService(userService) {
    this.userService = userService;
    this.listenForAuthenticationEventsOnUserService();
  }

  UserDataService.getDataRootForEmail = function(email) {
    return DATA_ROOT + '/' + getAidFromEmail(email);
  };

  UserDataService.prototype.listenForAuthenticationEventsOnUserService = function() {
    this.userService.bind('authenticated', function(email) {
      this.email = email;
      this.authenticated = true;
      this.rootRef = new Firebase(App.FIREBASE_URL);
    }.bind(this));

    this.userService.bind('deauthenticated', function() {
      delete this.email;
      delete this.authenticated;
      delete this.rootRef;
    }.bind(this));
  };

  UserDataService.prototype.set = function(relativePath, value) {
    var deferred = new Deferred();

    this.getRefFor(relativePath)
    .set(value, function onComplete(error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });

    deferred.timeout(TIMEOUT, 'Timed out while writing data: ' + relativePath);

    return deferred.promise;
  };

  UserDataService.prototype.get = function(relativePath) {
    var deferred = new Deferred();

    this.getRefFor(relativePath, deferred)
    .once('value', function successCallback(snapshot) {
      deferred.resolve(snapshot.val());
    });

    deferred.timeout(TIMEOUT, 'Timed out while reading data: ' + relativePath);

    return deferred.promise;
  };

  UserDataService.prototype.getRefFor = function(relativePath) {
    if (!this.authenticated) {
      throw new Error('UserDataService: not authenticated');
    }

    var aid = getAidFromEmail(this.email);
    var fullPath = DATA_ROOT + '/' + aid + '/' + relativePath;

    return this.rootRef.child(fullPath);
  };

  function getAidFromEmail(email) {
    return email.replace(/\./g, ':');
  }

  window.UserDataService = UserDataService;

}());