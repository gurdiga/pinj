(function() {
  'use strict';

  function PaymentTracker(userTracker, userDataService) {
    this.userTracker = userTracker;
    this.userDataService = userDataService;

    this.listenForRecordedTimestampsEventOnUserTracker();
  }

  MicroEvent.mixin(PaymentTracker);

  PaymentTracker.PAYMENT_PERIOD = days(31);
  PaymentTracker.TRIAL_PERIOD = days(31);

  PaymentTracker.prototype.listenForRecordedTimestampsEventOnUserTracker = function() {
    this.userTracker.bind('recorded-timestamps', this.checkIfPaymentOverdue.bind(this));
  };

  PaymentTracker.prototype.checkIfPaymentOverdue = function() {
    Deferred.all({
      'lastPayment': this.userDataService.get(UserData.LAST_PAYMENT_TIMESTAMP_PATH),
      'registration': this.userDataService.get(UserData.REGISTRATION_TIMESTAMP_PATH)
    })
    .then(function(timestamps) {
      if (PaymentTracker.outOfTrialPeriod(timestamps.registration) && PaymentTracker.paymentOverdue(timestamps.lastPayment)) {
        this.trigger('payment-overdue');
      } else {
        this.trigger('payment-checked');
      }
    }.bind(this))
    .catch(function(error) {
      console.error('Error in PaymentTracker:', error);
    });
  };

  PaymentTracker.paymentOverdue = function(lastPaymentTimestamp) {
    return Date.now() - lastPaymentTimestamp > PaymentTracker.PAYMENT_PERIOD;
  };

  PaymentTracker.outOfTrialPeriod = function(registrationTimestamp) {
    return Date.now() - registrationTimestamp > PaymentTracker.TRIAL_PERIOD;
  };

  function days(number) {
    return number * 24 * 3600 * 1000;
  }

  window.PaymentTracker = PaymentTracker;

}());
