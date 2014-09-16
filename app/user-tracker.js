(function() {
  'use strict';

  function UserTracker() {
    this.storeTimestampsOnAuthentication();
  }

  MicroEvent.mixin(UserTracker);

  UserTracker.prototype.storeTimestampsOnAuthentication = function() {
    App.userService.once('authenticated', function(email) {
      var userDataService = new UserDataService(email);
      var registrationTimestamp = 'timestamps/registration';
      var lastLoginTimestamp = 'timestamps/lastLogin';

      userDataService.set(lastLoginTimestamp, Firebase.ServerValue.TIMESTAMP)
      .then(function() {
        return userDataService.get(registrationTimestamp);
      })
      .then(function(timestamp) {
        if (timestamp) throw new Error('Registration timestamp is already recorded');
      })
      .then(function() {
        return userDataService.set(registrationTimestamp, Firebase.ServerValue.TIMESTAMP);
      })
      .then(function() {
        this.trigger('recorded-registration');
      }.bind(this))
      .catch(function(error) {
        console.error('Error in UserTracker', error);
      });
    }.bind(this));
  };

  window.UserTracker = UserTracker;

}());
