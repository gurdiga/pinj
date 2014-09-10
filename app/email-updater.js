(function() {
  'use strict';

  function EmailUpdater(emitter, infoPanel) {
    emitter.bind('authenticated', function(email) {
      infoPanel.textContent = email;
    });

    emitter.bind('deauthenticated', function() {
      infoPanel.textContent = '';
    });
  }

  window.EmailUpdater = EmailUpdater;

}());
