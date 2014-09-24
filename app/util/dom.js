(function() {
  'use strict';

  var DOM = {
    querySelector: function querySelector(selector, context) {
      context = context || document;

      var element = context.querySelector(selector);

      if (!element) throw new Error('Element not found by selector: “' + selector + '”');

      return element;
    },

    querySelectorAll: function(selector, context) {
      context = context || document;

      var elements = context.querySelectorAll(selector);

      if (elements.length === 0) throw new Error('Elements not found by selector: “' + selector + '”');

      return [].slice.call(elements);
    }
  };

  window.DOM = DOM;

}());
