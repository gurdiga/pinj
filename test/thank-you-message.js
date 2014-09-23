(function() {
  'use strict';

  describe('ThankYouMessage', function() {
    var DIALOG_OPEN_TIMEOUT = 200;
    this.timeout(DIALOG_OPEN_TIMEOUT + 50);

    var ThankYouMessage, querySelector;
    var hash, dialog;

    beforeEach(function() {
      ThankYouMessage = this.iframe.ThankYouMessage;
      querySelector = this.iframe.querySelector;

      hash = '#thank-you-message';
      dialog = querySelector(hash, this.app);
    });

    it('shows the dialog correspondint to the given hash', function(done) {
      new ThankYouMessage(hash);

      setTimeout(function() {
        expect(dialog).to.be.visible();

        var closeButton = querySelector('button.close', dialog);
        closeButton.click();

        done();
      }, DIALOG_OPEN_TIMEOUT);
    });
  });

}());
