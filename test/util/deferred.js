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

    describe('timing out', function() {
      it('can be timed out', function() {
        expect(deferred.timeout).to.be.a('function');
      });

      it('times out after given number of milliseconds with the given error message', function(done) {
        this.timeout(600);

        var timeout = 500;
        var errorMessage = 'Testing promise timeout';
        var deferred = new Deferred();

        deferred.timeout(timeout, errorMessage);
        deferred.promise
        .then(this.bubbleErrors(function() {
          expect('resolution').not.to.exist;
          done();
        }))
        .catch(this.bubbleErrors(function(error) {
          expect(error.message).to.contain(errorMessage);
          done();
        }));
      });
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
