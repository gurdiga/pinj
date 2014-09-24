(function() {
  'use strict';

  describe('PaymentTracker', function() {
    var PaymentTracker, UserTracker, UserDataService, Deferred, UserData;
    var paymentTracker, userTracker, userDataService;

    beforeEach(function() {
      PaymentTracker = this.iframe.PaymentTracker;
      UserTracker = this.iframe.UserTracker;
      UserDataService = this.iframe.UserDataService;
      Deferred = this.iframe.Deferred;
      UserData = this.iframe.UserData;

      userTracker = sinon.createStubInstance(UserTracker);
      MicroEvent.mixin(userTracker);
      userDataService = sinon.createStubInstance(UserDataService);

      paymentTracker = new PaymentTracker(userTracker, userDataService);
    });

    describe('payment period', function() {
      it('is 31 days', function() {
        expect(PaymentTracker.PAYMENT_PERIOD).to.eq(31 * 24 * 3600 * 1000);
      });
    });

    describe('trial period', function() {
      it('is 7 days', function() {
        expect(PaymentTracker.TRIAL_PERIOD).to.eq(7 * 24 * 3600 * 1000);
      });
    });

    describe('when last payment is older than a payment period ago', function() {
      beforeEach(function() {
        userDataService.get
          .withArgs(UserData.LAST_PAYMENT_TIMESTAMP)
          .returns(moreThanAPaymentPeriodAgo());
      });

      describe('when it’s not a trial user', function() {
        beforeEach(function() {
          userDataService.get
            .withArgs(UserData.REGISTRATION_TIMESTAMP)
            .returns(outOfTrialPeriod());
        });

        it('emits a “payment-overdue” event', function(done) {
          paymentTracker.once('payment-overdue', done);
          userTracker.trigger('recorded-timestamps');
        });
      });

      describe('when it’s a trial user', function() {
        beforeEach(function() {
          userDataService.get
            .withArgs(UserData.REGISTRATION_TIMESTAMP)
            .returns(withinTheTrialPeriod());
        });

        it('doesn’t emit the “payment-overdue” event', function(done) {
          waitToSeeTheEventNotEmitted(this).then(done);
          userTracker.trigger('recorded-timestamps');
        });

        it('emits “payment-checked” event', function(done) {
          paymentTracker.once('payment-checked', done);
          userTracker.trigger('recorded-timestamps');
        });
      });
    });

    describe('when last payment is within the payment period', function() {
      beforeEach(function() {
        userDataService.get
          .withArgs(UserData.LAST_PAYMENT_TIMESTAMP)
          .returns(lessThanAPaymentPeriodAgo());
        userDataService.get
          .withArgs(UserData.REGISTRATION_TIMESTAMP)
          .returns(outOfTrialPeriod());
      });

      it('doesn’t emit the “payment-overdue” event', function(done) {
        waitToSeeTheEventNotEmitted(this).then(done);
      });
    });

    function waitToSeeTheEventNotEmitted(context) {
      return {
        'then': function(done) {
          var eventTimeout = setTimeout(done, 20);

          paymentTracker.once('payment-overdue', context.bubbleErrors(function() {
            clearTimeout(eventTimeout);
            expect('payment-overdue event').not.to.exist;
            done();
          }));

          userTracker.trigger('recorded-timestamps');
        }
      };
    }

    var oneDay = 24 * 3600 * 1000;

    function moreThanAPaymentPeriodAgo() {
      return Deferred.createResolvedPromise(timeAgo(PaymentTracker.PAYMENT_PERIOD + oneDay));
    }

    function lessThanAPaymentPeriodAgo() {
      return Deferred.createResolvedPromise(timeAgo(PaymentTracker.PAYMENT_PERIOD - oneDay));
    }

    function withinTheTrialPeriod() {
      return Deferred.createResolvedPromise(timeAgo(PaymentTracker.TRIAL_PERIOD - oneDay));
    }

    function outOfTrialPeriod() {
      return Deferred.createResolvedPromise(timeAgo(PaymentTracker.TRIAL_PERIOD + oneDay));
    }

    function timeAgo(period) {
      return Date.now() - period;
    }

  });

}());
