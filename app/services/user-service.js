(function() {
  'use strict';

  function UserService() {
    this.ref = new Firebase(App.FIREBASE_URL);

    this.bind('firebase-login', this.tryRestoreSession.bind(this));
    this.auth = new FirebaseSimpleLogin(this.ref, function(error, user) {
      this.trigger('firebase-login', {
        'error': error,
        'user': user
      });
    }.bind(this));
  }

  MicroEvent.mixin(UserService);

  UserService.prototype.tryRestoreSession = function(session) {
    if (session.user) this.trigger('authenticated', session.user.email);
    if (!session.error && !session.user) {
      this.trigger('deauthenticated');
    }
  };

  UserService.prototype.registerUser = function(email, password) {
    var deferred = new Deferred();

    this.auth.createUser(email, password, function(error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });

    return deferred.promise;
  };

  UserService.prototype.authenticateUser = function(email, password) {
    var deferred = new Deferred();

    this.once('firebase-login', function(data) {
      if (data.error) deferred.reject(data.error);
      else if (data.user) deferred.resolve();
    });

    this.auth.login('password', {
      'email': email,
      'password': password
    });

    return deferred.promise
    .then(function() {
      this.trigger('authenticated', email);
    }.bind(this));
  };

  UserService.prototype.logout = function() {
    var deferred = new Deferred();

    this.once('firebase-login', function(data) {
      if (data.error) deferred.reject(data.error);
      else if (data.user) deferred.reject(new Error('Not logged out'));
      else deferred.resolve();
    });

    this.auth.logout();

    return deferred.promise
    .then(function() {
      this.trigger('deauthenticated');
    }.bind(this));
  };

  UserService.prototype.unregisterUser = function(email, password) {
    var deferred = new Deferred();

    this.auth.removeUser(email, password, function(error) {
      if (error === null) deferred.resolve();
      else deferred.reject(error);
    });

    return deferred.promise;
  };

  window.UserService = UserService;

}());
