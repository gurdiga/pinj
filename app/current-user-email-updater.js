(function() {
  'use strict';

  function CurrentUserEmailUpdater(emitter, infoPanel) {
    emitter.bind('authenticated', function(email) {
      infoPanel.textContent = email;
    });

    emitter.bind('deauthenticated', function() {
      infoPanel.textContent = '';
    });
  }

  window.CurrentUserEmailUpdater = CurrentUserEmailUpdater;

}());
