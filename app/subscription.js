(function() {
  'use strict';

  function Subscription(userDataService) {
    this.userDataService = userDataService;
  }

  MicroEvent.mixin(Subscription);

  Subscription.prototype.get = function() {
    return this.userDataService.get(UserData.SUBSCRIPTION_PATH)
    .catch(function(error) {
      console.error('Error in Subscription#get:', error);
    });
  };

  Subscription.prototype.set = function(newValue) {
    return this.userDataService.set(UserData.SUBSCRIPTION_PATH, newValue)
    .catch(function(error) {
      console.error('Error in Subscription#set:', error);
    });
  };

  window.Subscription = Subscription;

}());
