(function() {
  'use strict';

  function Deferred(ms) {
    this.inner = Q.defer();
    this.promise = this.inner.promise;

    if (ms) this.resolveIn(ms);
  }

  Deferred.prototype.resolve = function() {
    return this.inner.resolve.apply(this.inner, arguments);
  };

  Deferred.prototype.reject = function() {
    return this.inner.reject.apply(this.inner, arguments);
  };

  Deferred.prototype.timeout = function(ms, message) {
    setTimeout(function() {
      this.inner.reject(new Error('Timeout error: ' + message));
    }.bind(this), ms);
  };

  Deferred.prototype.resolveIn = function(ms) {
    setTimeout(function() {
      this.inner.resolve();
    }.bind(this), ms);
  };

  Deferred.createResolvedPromise = function(value) {
    var deferred = new Deferred();
    deferred.resolve(value);
    return deferred.promise;
  };

  Deferred.createRejectedPromise = function(reason) {
    var deferred = new Deferred();
    deferred.reject(reason);
    return deferred.promise;
  };

  Deferred.all = function(hash) {
    var keys = Object.keys(hash);
    var promises = keys.map(function(k) { return hash[k]; });

    return Q.all(promises).then(function(responsesArray) {
      var responsesHash = {};

      keys.forEach(function(key, i) {
        responsesHash[key] = responsesArray[i];
      });

      return responsesHash;
    });
  };

  window.Deferred = Deferred;

}());