(function() {
  'use strict';

  describe('ThankYouMessage', function() {
    var DIALOG_OPEN_TIMEOUT = 200;
    this.timeout(DIALOG_OPEN_TIMEOUT + 50);

    var ThankYouMessage, DOM;
    var hash, dialog;

    beforeEach(function() {
      ThankYouMessage = this.iframe.ThankYouMessage;
      DOM = this.iframe.DOM;

      hash = '#thank-you-message';
      dialog = DOM.querySelector(hash, this.app);
    });

    it('shows the dialog correspondint to the given hash', function(done) {
      new ThankYouMessage(hash);

      setTimeout(function() {
        expect(dialog).to.be.visible();
        done();
      }, DIALOG_OPEN_TIMEOUT);
    });

    afterEach(function() {
      var closeButton = DOM.querySelector('button.close', dialog);
      closeButton.click();
    });
  });

}());
