(function() {
  'use strict';

  before(function() {
    this.navigateTo = getNavigateTo(this);
    this.submit = getSubmit(this);
  });

  function getNavigateTo(self) {
    return function navigateTo(pathname) {
      expect(pathname, 'pathname to navigate to').to.exist;
      self.iframe.location = pathname;
      return waitForIframeOnLoadEvent(self);
    };
  }

  function getSubmit(self) {
    return function submit(form) {
      expect(form, 'form to submit').to.exist;
      var subimitButton = form.querySelector('button[type="submit"]');
      expect(subimitButton, 'submit button').to.exist;
      subimitButton.click();

      return waitForIframeOnLoadEvent(self);
    }
  }

  function waitForIframeOnLoadEvent(self) {
    var deferred = Q.defer();

    once('load', self.iframeElement, function() {
      var redirectingPage = !!self.iframe.document.querySelector('meta[http-equiv="refresh"]');

      if (redirectingPage) replace(deferred).with(waitForIframeOnLoadEvent(self));
      else replace(deferred).with(self.waitForClientToBeReady());
    });

    return deferred.promise;
  }

  function replace(deferred) {
    return {
      'with': function(promise) {
        promise.then(deferred.resolve, deferred.reject);
      }
    };
  }

  function once(eventName, element, f) {
    function callback() {
      var args = [].slice.call(arguments);
      element.removeEventListener(eventName, callback);
      f(args);
    }

    element.addEventListener(eventName, callback);
  };

}());
