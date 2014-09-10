(function() {
  'use strict';

  beforeEach(function() {
    this.bubbleErrors = bubbleErrors;
  });

  function bubbleErrors(f) {
    return function() {
      var args = [].slice.apply(arguments);

      window.setTimeout(function() {
        f.apply(this, args);
      });
    };
  }

}());
