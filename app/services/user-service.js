(function() {
  'use strict';

  var TIMEOUT = 5000;

  function UserService() {
    this.ref = new Firebase(App.FIREBASE_URL);

    this.once('firebase-login', this.tryRestoreSession.bind(this));
    this.ref.onAuth(this.trigger.bind(this, 'firebase-login'));
  }

  MicroEvent.mixin(UserService);

  UserService.prototype.tryRestoreSession = function(authData) {
    var self = this;

    if (authData) emit('authenticated', authData.password.email);
    else emit('not-authenticated');

    function emit(eventName, data) {
      setTimeout(function() {
        self.trigger(eventName, data);
      });
    }
  };

  UserService.prototype.registerUser = function(email, password) {
    var deferred = new Deferred();

    this.ref.createUser({
      'email': email,
      'password': password
    }, function(error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });

    deferred.timeout(TIMEOUT, 'UserService: timed out on registration: ' + email);

    return deferred.promise;
  };

  UserService.prototype.authenticateUser = function(email, password, isFirstTime) {
    var self = this;
    var deferred = new Deferred();

    self.ref.authWithPassword({
      'email': email,
      'password': password
    }, function(error, authData) {
      if (error) deferred.reject(error);
      else if (isFirstTime) storeUID(email, authData.uid).then(function() { deferred.resolve(); });
      else deferred.resolve();
    });

    deferred.timeout(TIMEOUT, 'UserService: timed out on authentication: ' + email);

    return deferred.promise
    .then(this.trigger.bind(this, 'authenticated', email));

    function storeUID(email, uid) {
      var deferred = new Deferred();
      var uidPath = UserService.getUIDPathForEmail(email);

      self.ref.child(uidPath)
      .set(uid, function(error) {
        if (error) deferred.reject(error);
        else deferred.resolve();
      });

      return deferred.promise;
    }
  };

  UserService.getUIDPathForEmail = function(email) {
    return UserDataService.getDataRootForEmail(email) + '/' + UserData.UID_PATH;
  };

  UserService.prototype.logout = function() {
    var deferred = new Deferred();

    this.once('firebase-login', function(user) {
      if (user) deferred.reject(new Error('Not logged out'));
      else deferred.resolve();
    });

    this.ref.unauth();

    deferred.timeout(TIMEOUT, 'UserService: timed out on logout');

    return deferred.promise
    .then(this.trigger.bind(this, 'deauthenticated'));
  };

  UserService.prototype.unregisterUser = function(email, password) {
    var deferred = new Deferred();

    this.ref.removeUser({
      'email': email,
      'password': password
    }, function(error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });

    deferred.timeout(TIMEOUT, 'UserService: timed out on user unregistration: ' + email);

    return deferred.promise;
  };

  window.UserService = UserService;

}());
