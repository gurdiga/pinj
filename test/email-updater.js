(function() {
  'use strict';

  describe('EmailUpdater', function() {
    var EmailUpdater;
    var emitter, infoPanel, email;

    beforeEach(function() {
      EmailUpdater = this.iframe.EmailUpdater;

      email = 'test@test.com';
      infoPanel = document.createElement('span');
      emitter = {};
      MicroEvent.mixin(emitter);

      new EmailUpdater(emitter, infoPanel);
    });

    it('shows current user’s email in the header on authentication', function() {
      emitter.trigger('authenticated', email);
      expect(infoPanel.textContent).to.contain(email);
    });

    it('hides the email on logout', function() {
      infoPanel.textContent = 'test@test.com';
      emitter.trigger('deauthenticated');
      expect(infoPanel.textContent).to.be.empty;
    });
  });

}());
