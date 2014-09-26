(function() {
  'use strict';

  var TIMEOUT = 3000;

  function UserService() {
    this.ref = new Firebase(App.FIREBASE_URL);

    this.once('firebase-login', this.tryRestoreSession.bind(this));
    this.auth = new FirebaseSimpleLogin(this.ref, this.emitFirebaseLoginEvent.bind(this));
  }

  MicroEvent.mixin(UserService);

  UserService.prototype.tryRestoreSession = function(session) {
    if (session.user) this.trigger('authenticated', session.user.email);
    else if (!session.error) this.trigger('not-authenticated');
  };

  UserService.prototype.emitFirebaseLoginEvent = function(error, user) {
    this.trigger('firebase-login', {
      'error': error,
      'user': user
    });
  };

  UserService.prototype.registerUser = function(email, password) {
    var deferred = new Deferred();

    this.auth.createUser(email, password, function(error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });

    deferred.timeout(TIMEOUT, 'Timed out on registration: ' + email);

    return deferred.promise;
  };

  UserService.prototype.authenticateUser = function(email, password) {
    var deferred = new Deferred();

    this.once('firebase-login', function(data) {
      if (data.error) deferred.reject(data.error);
      else if (data.user) deferred.resolve();
    });

    deferred.timeout(TIMEOUT, 'Timed out on authentication: ' + email);

    this.auth.login('password', {
      'email': email,
      'password': password
    });

    return deferred.promise
    .then(this.trigger.bind(this, 'authenticated', email));
  };

  UserService.prototype.logout = function() {
    var deferred = new Deferred();

    this.once('firebase-login', function(data) {
      if (data.error) deferred.reject(data.error);
      else if (data.user) deferred.reject(new Error('Not logged out'));
      else deferred.resolve();
    });

    this.auth.logout();

    deferred.timeout(TIMEOUT, 'Timed out on logout');

    return deferred.promise
    .then(this.trigger.bind(this, 'deauthenticated'));
  };

  UserService.prototype.unregisterUser = function(email, password) {
    var deferred = new Deferred();

    this.auth.removeUser(email, password, function(error) {
      if (error === null) deferred.resolve();
      else deferred.reject(error);
    });

    deferred.timeout(TIMEOUT, 'Timed out on unregistration: ' + email);

    return deferred.promise;
  };

  window.UserService = UserService;

}());
