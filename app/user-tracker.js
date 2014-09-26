(function() {
  'use strict';

  function UserTracker(userService, userDataService) {
    this.userService = userService;
    this.userDataService = userDataService;

    this.listenForAuthenticationEventOnUserService();
  }

  MicroEvent.mixin(UserTracker);

  UserTracker.prototype.listenForAuthenticationEventOnUserService = function() {
    this.userService.bind('authenticated', this.recordTimestamps.bind(this));
  };

  UserTracker.prototype.recordTimestamps = function() {
    var userDataService = this.userDataService;

    Deferred.all({
      '_': userDataService.set(UserData.LAST_LOGIN_TIMESTAMP_PATH, Firebase.ServerValue.TIMESTAMP),
      'registrationTimestamp': userDataService.get(UserData.REGISTRATION_TIMESTAMP_PATH)
    })
    .then(function(data) {
      if (!data.registrationTimestamp) return userDataService.set(UserData.REGISTRATION_TIMESTAMP_PATH, Firebase.ServerValue.TIMESTAMP);
    })
    .then(this.trigger.bind(this, 'recorded-timestamps'))
    .catch(function(error) {
      console.error('Error in UserTracker', error);
    });
  };

  window.UserTracker = UserTracker;

}());
