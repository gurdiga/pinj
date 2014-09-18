(function() {
  'use strict';

  function UserTracker(userService, userDataService) {
    this.userDataService = userDataService;
    this.listenForAuthenticationEventOn(userService);
  }

  MicroEvent.mixin(UserTracker);

  UserTracker.prototype.listenForAuthenticationEventOn = function(userService) {
    userService.once('authenticated', this.recordTimestamps.bind(this));
  };

  UserTracker.prototype.recordTimestamps = function() {
    var registrationTimestampPath = 'timestamps/registration';
    var lastLoginTimestampPath = 'timestamps/lastLogin';
    var userDataService = this.userDataService;

    userDataService.set(lastLoginTimestampPath, Firebase.ServerValue.TIMESTAMP)
    .then(function() {
      return userDataService.get(registrationTimestampPath);
    })
    .then(function(registrationTimestamp) {
      if (!registrationTimestamp) return userDataService.set(registrationTimestampPath, Firebase.ServerValue.TIMESTAMP);
    })
    .then(function() {
      this.trigger('recorded-registration');
    }.bind(this))
    .catch(function(error) {
      console.error('Error in UserTracker', error);
    });
  };

  window.UserTracker = UserTracker;

}());
