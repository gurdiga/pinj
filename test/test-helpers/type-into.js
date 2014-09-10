(function() {
  'use strict';

  beforeEach(function() {
    this.type = type;
  });

  function type(text) {
    return {
      into: function(field) {
        field.value = text;

        var inputEvent = field.ownerDocument.createEvent('HTMLEvents');
        inputEvent.initEvent('input', true, false);
        field.dispatchEvent(inputEvent);
      }
    };
  }

}());
