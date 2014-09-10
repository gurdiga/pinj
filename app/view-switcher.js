(function() {
  'use strict';

  function ViewSwitcher(specs) {
    specs.forEach(function setWatchers(spec) {
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
        element.style.display = 'none';
      }
    });
  }

  window.ViewSwitcher = ViewSwitcher;

}());
