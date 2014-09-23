(function() {
  'use strict';

  describe.integration('UserDataService', function() {
    this.timeout(10000);

    var UserDataService, App, Firebase, Deferred;
    var userDataService, email, password, aPieceOfData;

    before(function(done) {
      UserDataService = this.iframe.UserDataService;
      App = this.iframe.App;
      Firebase = this.iframe.Firebase;
      Deferred = this.iframe.Deferred;

      email = 'user-data-service@test.com';
      password = 'Passw0rd';
      aPieceOfData = 'some data';
      userDataService = new UserDataService(App.userService);

      createTestUserAndAuthenticate()
      .then(done)
      .catch(done);
    });

    it('can write a pice of data at a given path', function(done) {
      userDataService.set('a/given/path', aPieceOfData)
      .then(done)
      .catch(done);
    });

    it('can read the written piece of data', function(done) {
      userDataService.get('a/given/path')
      .then(this.bubbleErrors(function(data) {
        expect(data).to.equal(aPieceOfData);
        done();
      }))
      .catch(done);
    });

    after(function(done) {
      waitForPaymentTracker()
      .then(removeTestData)
      .then(logoutAndRemoveTestUser)
      .then(done)
      .catch(done);
    });

    function createTestUserAndAuthenticate() {
      return App.userService.registerUser(email, password)
      .then(function() {
        return App.userService.authenticateUser(email, password);
      });
    }

    function waitForPaymentTracker() {
      var PAYMENT_TRACKER_TIMEOUT = 500;
      var deferred = new Deferred(PAYMENT_TRACKER_TIMEOUT);

      App.paymentTracker.once('payment-checked', function() {
        deferred.resolve();
      });

      return deferred.promise;
    }

    function removeTestData() {
      var deferred = new Deferred();
      var ref = new Firebase(App.FIREBASE_URL + '/data/user-data-service@test:com');

      ref.remove(function(error) {
        if (error) console.error('Error on data cleanup', error);
        deferred.resolve();
      });

      return deferred.promise;
    }

    function logoutAndRemoveTestUser() {
      return App.userService.logout()
      .then(function() {
        return App.userService.unregisterUser(email, password);
      });
    }

  });

}());
