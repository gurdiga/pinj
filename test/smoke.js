(function() {
  'use strict';

  describe('Smoke test', function() {
    var querySelector;

    beforeEach(function(done) {
      this.navigateTo('/').then(done, done);
      querySelector = this.iframe.DOM.querySelector;
    });

    it('runs', function(done) {
      var self = this;
      var registrationButton = querySelector('#registration-button', self.app);
      var registrationPath = registrationButton.getAttribute('href');

      self.navigateTo(registrationPath)
      .then(function() {
        var form = self.app.querySelector('#registration-form');
        expect(form).to.exist;
        expect(form).to.be.visible();
      })
      .then(done, done);
    });
  });

}());
