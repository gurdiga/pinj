(function() {
  'use strict';

  describe('SubscriptionDialog', function() {
    var Deferred, App;
    var subscriptionDialog, subscription;

    beforeEach(function() {
      Deferred = this.iframe.Deferred;
      App = this.iframe.App;

      subscription = App.subscription;
      subscriptionDialog = App.subscriptionDialog;
    });

    describe('when user didn’t yet pick a subscription', function() {
      beforeEach(function() {
        this.sinon.stub(subscription, 'get').returns(Deferred.createResolvedPromise());
      });

      it('shows all the options unchecked', function(done) {
        subscriptionDialog.open()
        .then(function() {
          expect(subscriptionDialog.noOptionIsPicked()).to.be.true;
          return subscriptionDialog.close().then(done);
        })
        .catch(done);
      });
    });

    describe('when the user already picked a subscription', function() {
      var currentSubscription;

      beforeEach(function() {
        currentSubscription = 'c30';
        this.sinon.stub(subscription, 'get').returns(Deferred.createResolvedPromise(currentSubscription));
      });

      it('shows it as selected', function(done) {
        subscription.once('loaded', function() {
          expect(subscriptionDialog.getCurrentSubscription()).to.equal(currentSubscription);
          return subscriptionDialog.close().then(done);
        });

        subscriptionDialog.open()
        .catch(done);
      });
    });

    describe('changing subscription', function() {
      beforeEach(function() {
        this.sinon.stub(subscription, 'get').returns(Deferred.createResolvedPromise());
        this.sinon.stub(subscription, 'set').returns(Deferred.createResolvedPromise());
      });

      it('saved the selected option', function(done) {
        subscriptionDialog.open()
        .then(function() {
          var newSubscription = 'c60';
          subscriptionDialog.selectSubscription(newSubscription);
          subscriptionDialog.save();

          expect(subscription.set).to.have.been.calledWith(newSubscription);

          return subscriptionDialog.close().then(done);
        })
        .catch(done);
      });
    });
  });

}());
