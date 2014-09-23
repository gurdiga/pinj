(function() {
  'use strict';

  function ThankYouMessage(hash) {
    this.displayDialog(hash);
  }

  ThankYouMessage.prototype.displayDialog = function(selector) {
    jQuery(selector).modal('show');
  };

  window.ThankYouMessage = ThankYouMessage;

}());
