(function() {
  'use strict';

  describe('SubscriptionInquirer', function() {
    var SubscriptionInquirer, UserTracker, UserDataService, Deferred, SubscriptionDialog, UserData;
    var linkToOpenSubscriptionDialog, trialPeriodLength, userTracker, userDataService, someTime;

    beforeEach(function() {
      SubscriptionInquirer = this.iframe.SubscriptionInquirer;
      SubscriptionDialog = this.iframe.SubscriptionDialog;
      UserTracker = this.iframe.UserTracker;
      UserDataService = this.iframe.UserDataService;
      Deferred = this.iframe.Deferred;
      UserData = this.iframe.UserData;

      linkToOpenSubscriptionDialog = document.createElement('a');
      someTime = 42;
      trialPeriodLength = 10000;

      userTracker = sinon.createStubInstance(UserTracker);
      MicroEvent.mixin(userTracker);
      userDataService = sinon.createStubInstance(UserDataService);

      new SubscriptionInquirer(linkToOpenSubscriptionDialog, trialPeriodLength, userTracker, userDataService);
    });

    describe('if user didn’t yet pick a subscription', function() {
      beforeEach(function() {
        userDataService.get
          .withArgs(UserData.SUBSCRIPTION_PATH)
          .returns(Deferred.createResolvedPromise(null));
      });

      describe('out of the trial period', function() {
        beforeEach(function() {
          var moreThanOneTrialPeriodAgo = Date.now() - trialPeriodLength - someTime;

          userDataService.get
            .withArgs(UserData.REGISTRATION_TIMESTAMP_PATH)
            .returns(Deferred.createResolvedPromise(moreThanOneTrialPeriodAgo));
        });

        it('asks for a subscription', function(done) {
          linkToOpenSubscriptionDialog.addEventListener('click', function() {
            done();
          });

          userTracker.trigger('recorded-timestamps');
        });
      });

      describe('within the trial period', function() {
        beforeEach(function() {
          var withinTheTrialPeriod = Date.now() - trialPeriodLength + someTime;

          userDataService.get
            .withArgs(UserData.REGISTRATION_TIMESTAMP_PATH)
            .returns(Deferred.createResolvedPromise(withinTheTrialPeriod));
        });

        it('does not ask for a subscription', function(done) {
          checkDialogIsNotOpened().then(done);
        });
      });
    });


    describe('if user has already picked a subscription', function() {
      beforeEach(function() {
        var currentSubscription = 'c42';

        userDataService.get
          .withArgs(UserData.SUBSCRIPTION_PATH)
          .returns(Deferred.createResolvedPromise(currentSubscription));
      });

      it('does not ask for a subscription', function(done) {
        checkDialogIsNotOpened().then(done);
      });
    });

    function checkDialogIsNotOpened() {
      var TIME_TO_WAIT_FOR_CLICK = 200;
      var deferred = new Deferred(TIME_TO_WAIT_FOR_CLICK);

      linkToOpenSubscriptionDialog.addEventListener('click', function() {
        expect('opening the dialog').not.to.exist;
        deferred.resolve();
      });

      userTracker.trigger('recorded-timestamps');

      return deferred.promise;
    }
  });

}());
