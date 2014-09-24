(function() {
  'use strict';

  function UserTracker(userService, userDataService) {
    this.userDataService = userDataService;
    this.listenForAuthenticationEventOn(userService);
  }

  MicroEvent.mixin(UserTracker);

  UserTracker.prototype.listenForAuthenticationEventOn = function(userService) {
    userService.bind('authenticated', function() {
      this.recordTimestamps();
    }.bind(this));
  };

  UserTracker.prototype.recordTimestamps = function() {
    var registrationTimestampPath = UserData.REGISTRATION_TIMESTAMP;
    var userDataService = this.userDataService;

    userDataService.set(UserData.LAST_LOGIN_TIMESTAMP, Firebase.ServerValue.TIMESTAMP)
    .then(function() {
      return userDataService.get(UserData.REGISTRATION_TIMESTAMP);
    })
    .then(function(registrationTimestamp) {
      if (!registrationTimestamp) return userDataService.set(UserData.REGISTRATION_TIMESTAMP, Firebase.ServerValue.TIMESTAMP);
    })
    .then(function() {
      this.trigger('recorded-timestamps');
    }.bind(this))
    .catch(function(error) {
      console.error('Error in UserTracker', error);
    });
  };

  window.UserTracker = UserTracker;

}());
