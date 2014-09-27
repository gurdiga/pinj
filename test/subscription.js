(function() {
  'use strict';

  describe('Subscription', function() {
    var Subscription, UserDataService, UserData, Deferred, console;
    var subscription, userDataService, subscriptionId, userDataServiceError;


    beforeEach(function() {
      Subscription = this.iframe.Subscription;
      UserDataService = this.iframe.UserDataService;
      UserData = this.iframe.UserData;
      Deferred = this.iframe.Deferred;
      console = this.iframe.console;

      subscriptionId = 'c15';
      userDataServiceError = new Error('Something bad happened in UserDataService');
      this.sinon.stub(console, 'error');

      userDataService = sinon.createStubInstance(UserDataService);
      subscription = new Subscription(userDataService);
    });

    describe('#get', function() {
      describe('on success', function() {
        beforeEach(function() {
          userDataService.get.returns(Deferred.createResolvedPromise(subscriptionId));
        });

        it('delegates to UserDataService and triggers “loaded” event', function(done) {
          var isEventEmitted, emittedValue;

          subscription.once('loaded', function(subscriptionId) {
            isEventEmitted = true;
            emittedValue = subscriptionId;
          });

          subscription.get()
          .then(function(returnValue) {
            expect(userDataService.get).to.have.been.calledWith(UserData.SUBSCRIPTION_PATH);
            expect(returnValue, 'return value').to.equal(subscriptionId);
            expect(isEventEmitted).to.be.true;
            expect(emittedValue).to.equal(subscriptionId);
          })
          .then(done)
          .catch(done);
        });
      });

      describe('on errors', function() {
        beforeEach(function() {
          userDataService.get.returns(Deferred.createRejectedPromise(userDataServiceError));
        });

        it('catches and logs UserDataService errors', function(done) {
          subscription.get()
          .then(function() {
            expect(console.error).to.have.been.calledWith(sinon.match.string, userDataServiceError);
          })
          .then(done)
          .catch(done);
        });
      });
    });

    describe('#set', function() {
      describe('on success', function() {
        beforeEach(function() {
          userDataService.set.returns(Deferred.createResolvedPromise());
        });

        it('delegates to UserDataService and emits “changed” event', function(done) {
          var isEventEmitted, emittedValue;

          subscription.once('changed', function(subscriptionId) {
            isEventEmitted = true;
            emittedValue = subscriptionId;
          });

          subscription.set(subscriptionId)
          .then(function() {
            expect(userDataService.set).to.have.been.calledWith(UserData.SUBSCRIPTION_PATH, subscriptionId);
            expect(isEventEmitted).to.be.true;
            expect(emittedValue).to.equal(subscriptionId);
          })
          .then(done)
          .catch(done);
        });
      });

      describe('on errors', function() {
        beforeEach(function() {
          userDataService.set.returns(Deferred.createRejectedPromise(userDataServiceError));
        });

        it('catches and logs UserDataService errors', function(done) {
          subscription.set(subscriptionId)
          .then(function() {
            expect(console.error).to.have.been.calledWith(sinon.match.string, userDataServiceError);
          })
          .then(done)
          .catch(done);
        });
      });
    });
  });

}());
