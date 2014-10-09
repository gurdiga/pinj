(function() {
  'use strict';

  before(function() {
    this.waitForClientToBeReady = getWaitForClientToBeReady(this);
  });

  function getWaitForClientToBeReady(self) {
    return function() {
      var deferred = Q.defer();

      if (self.iframe.testClient) self.iframe.testClient.bind('ready', resolve(deferred));
      else reject(deferred);

      return deferred.promise;
    };

    function resolve(deferred) {
      return function() {
        deferred.resolve();
      };
    }

    function reject(deferred) {
      deferred.reject(new Error('Test client not found on page “' + self.iframe.location.pathname + '”'));
    }
  }

}());
