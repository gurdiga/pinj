(function() {
  'use strict';

  function SubscriptionInquirer(linkToOpenSubscriptionDialog, trialPeriodLength, userTracker, userDataService) {
    this.trialPeriodLength = trialPeriodLength;
    this.userDataService = userDataService;
    this.linkToOpenSubscriptionDialog = linkToOpenSubscriptionDialog;
    this.userTracker = userTracker;

    this.listenForTheAuthenticatedEventOnUserTracker();
  }

  SubscriptionInquirer.prototype.listenForTheAuthenticatedEventOnUserTracker = function() {
    this.userTracker.bind('recorded-timestamps', this.checkIfAlreadyPickedASubscription.bind(this));
  };

  SubscriptionInquirer.prototype.checkIfAlreadyPickedASubscription = function() {
    Deferred.all({
      'subscription': this.userDataService.get(UserData.SUBSCRIPTION_PATH),
      'registrationTimestamp': this.userDataService.get(UserData.REGISTRATION_TIMESTAMP_PATH)
    })
    .then(function(data) {
      var outOfTrial = (data.registrationTimestamp + this.trialPeriodLength) < Date.now();

      if (!data.subscription && outOfTrial) this.openSubscriptionDialog();
    }.bind(this))
    .catch(function(error) {
      console.error('Error in SubscriptionInquirer#checkIfAlreadyPickedASubscription', error);
    });
  };

  SubscriptionInquirer.prototype.openSubscriptionDialog = function() {
    this.linkToOpenSubscriptionDialog.click();
  };

  window.SubscriptionInquirer = SubscriptionInquirer;

}());
