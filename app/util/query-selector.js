(function() {
  'use strict';

  function querySelector(selector, context) {
    context = context || document;

    var element = context.querySelector(selector);

    if (!element) throw new Error('Element not found by selector: “' + selector + '”');

    return element;
  }

  window.querySelector = querySelector;

}());
