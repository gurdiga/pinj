(function() {
  'use strict';

  describe('CurrentUserEmailUpdater', function() {
    var CurrentUserEmailUpdater;
    var emitter, infoPanel, email;

    beforeEach(function() {
      CurrentUserEmailUpdater = this.iframe.CurrentUserEmailUpdater;

      email = 'test@test.com';
      infoPanel = document.createElement('span');
      emitter = {};
      MicroEvent.mixin(emitter);

      new CurrentUserEmailUpdater(emitter, infoPanel);
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
