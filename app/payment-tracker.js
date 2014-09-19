(function() {
  'use strict';

  function PaymentTracker(userService, userDataService) {
    this.userDataService = userDataService;

    this.listenForAuthenticatedEventOn(userService);
  }

  MicroEvent.mixin(PaymentTracker);

  PaymentTracker.PAYMENT_PERIOD = days(31);
  PaymentTracker.TRIAL_PERIOD = days(7);

  PaymentTracker.prototype.listenForAuthenticatedEventOn = function(userService) {
    userService.bind('authenticated', function() {
      this.checkIfPaymentOverdue();
    }.bind(this));
  };

  PaymentTracker.prototype.checkIfPaymentOverdue = function() {
    this.userDataService.get('timestamps/lastPayment')
    .then(function(lastPaymentTimestamp) {
      return this.userDataService.get('timestamps/registration')
      .then(function(registrationTimestamp) {
        return {
          'lastPayment': lastPaymentTimestamp,
          'registration': registrationTimestamp
        };
      });
    }.bind(this))
    .then(function(timestamps) {
      if (PaymentTracker.outOfTrialPeriod(timestamps.registration) && PaymentTracker.paymentOverdue(timestamps.lastPayment)) {
        this.trigger('payment-overdue');
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
