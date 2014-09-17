(function() {
  'use strict';

  function UserTracker(userService) {
    this.userService = userService;
    this.storeTimestampsOnAuthentication();
  }

  MicroEvent.mixin(UserTracker);

  UserTracker.prototype.storeTimestampsOnAuthentication = function() {
    this.userService.once('authenticated', function(email) {
      var userDataService = new UserDataService(email);
      var registrationTimestamp = 'timestamps/registration';
      var lastLoginTimestamp = 'timestamps/lastLogin';

      userDataService.set(lastLoginTimestamp, Firebase.ServerValue.TIMESTAMP)
      .then(function() {
        return userDataService.get(registrationTimestamp);
      })
      .then(function(timestamp) {
        if (!timestamp) return userDataService.set(registrationTimestamp, Firebase.ServerValue.TIMESTAMP);
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
