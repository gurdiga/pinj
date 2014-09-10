(function() {
  'use strict';

  describe('Deferred', function() {
    var Deferred, deferred;

    beforeEach(function() {
      Deferred = this.iframe.Deferred;
      deferred = new Deferred();
    });

    it('can be resolved', function() {
      deferred.resolve();
    });

    it('can be rejected', function() {
      deferred.reject();
    });

    it('has a promise', function() {
      expect(deferred.promise).to.exist;
    });

    describe('promise', function() {
      it('its then() is called with the resolved value', function(done) {
        var resolutionValue = 42;

        deferred.promise.then(function(value) {
          expect(value).to.equal(resolutionValue);
          done();
        });

        deferred.resolve(resolutionValue);
      });

      it('its catch() is called with the rejection reason', function(done) {
        var rejectionReason = new Error('Something bad happened');

        deferred.promise.catch(function(reason) {
          expect(reason).to.equal(rejectionReason);
          done();
        });

        deferred.reject(rejectionReason);
      });
    });
  });

}());
