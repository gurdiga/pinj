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
      it('times out after given number of milliseconds with the given error message', function(done) {
        var deferred = new Deferred();
        var promiseTimeout = 20;
        var errorMessage = 'Testing promise timeout';
        var startTime = Date.now();

        deferred.timeout(promiseTimeout, errorMessage);
        deferred.promise
        .catch(function(error) {
          var realPromiseTimeout = Date.now() - startTime;
          var allowedLag = 10;

          expect(realPromiseTimeout).to.be.within(promiseTimeout, promiseTimeout + allowedLag);
          expect(error.message).to.contain(errorMessage);
        })
        .then(done)
        .catch(done);
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

    describe('auto-resolution', function() {
      describe('when a number of milliseconds are passed to constructor', function() {
        it('auto-resolves', function(done) {
          new Deferred(20).promise.then(done, done);
        });
      });
    });

    describe('all: compound promise', function() {
      var promises = {};

      beforeEach(function() {
        promises = {
          'a': Deferred.createResolvedPromise('a'),
          'b': Deferred.createResolvedPromise('b'),
          'c': Deferred.createResolvedPromise('c')
        };
      });

      it('returns a hash of data for a hash of promises', function(done) {
        Deferred.all(promises)
        .then(function(data) {
          expect(data).to.deep.equal({
            'a': 'a',
            'b': 'b',
            'c': 'c'
          });
        })
        .then(done)
        .catch(done);
      });

      describe('when any of the given promises fail', function() {
        var reason;

        beforeEach(function() {
          reason = new Error('something bad happened');
          promises['a'] = Deferred.createRejectedPromise(reason);
          promises['b'] = Deferred.createRejectedPromise(new Error('any other error is lost'));
        });

        it('the compound promise fails for the same reason', function(done) {
          Deferred.all(promises)
          .catch(function(error) {
            expect(error).to.equal(reason);
            done();
          });
        });
      });
    });
  });

}());
