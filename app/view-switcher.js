(function() {
  'use strict';

  function ViewSwitcher(specs) {
    specs.forEach(function setWatchers(spec) {
      spec.elementsToShow = spec.elementsToShow || [];
      spec.elementsToHide = spec.elementsToHide || [];

      spec.emitters.forEach(function bindToEmitter(emitter) {
        emitter.bind(spec.eventName, function() {
          spec.elementsToShow.forEach(show);
          spec.elementsToHide.forEach(hide);
          document.body.classList.add('authenticated');
        });
      });

      function show(element) {
        element.style.display = '';
      }

      function hide(element) {
        element.style.cssText = 'display:none !important';
      }
    });
  }

  window.ViewSwitcher = ViewSwitcher;

}());
