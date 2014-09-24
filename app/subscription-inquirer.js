(function() {
  'use strict';

  function SubscriptionInquirer(linkToOpenSubscriptionDialog, trialPeriodLength, userTracker, userDataService) {
    this.trialPeriodLength = trialPeriodLength;
    this.userDataService = userDataService;
    this.linkToOpenSubscriptionDialog = linkToOpenSubscriptionDialog;

    this.listenForTheAuthenticatedEventOn(userTracker);
  }

  SubscriptionInquirer.prototype.listenForTheAuthenticatedEventOn = function(userTracker) {
    userTracker.bind('recorded-timestamps', this.checkIfAlreadyPickedASubscription.bind(this));
  };

  SubscriptionInquirer.prototype.checkIfAlreadyPickedASubscription = function() {
    this.userDataService.get(SubscriptionDialog.DATA_PATH)
    .then(function(subscription) {
      if (!subscription) this.checkIfOutOfTrial();
    }.bind(this))
    .catch(function(error) {
      console.error('Error in SubscriptionInquirer#checkIfAlreadyPickedASubscription', error);
    });
  };

  SubscriptionInquirer.prototype.checkIfOutOfTrial = function() {
    this.userDataService.get('timestamps/registration')
    .then(function(registrationTimestamp) {
      var outOfTrial = (registrationTimestamp + this.trialPeriodLength) < Date.now();

      if (outOfTrial) this.openSubscriptionDialog();
    }.bind(this))
    .catch(function(error) {
      console.error('Error in SubscriptionInquirer#checkIfOutOfTrial', error);
    });
  };

  SubscriptionInquirer.prototype.openSubscriptionDialog = function() {
    this.linkToOpenSubscriptionDialog.click();
  };

  window.SubscriptionInquirer = SubscriptionInquirer;

}());
