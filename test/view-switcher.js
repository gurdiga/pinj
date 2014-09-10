(function() {
  'use strict';

  describe('View switcher', function() {
    var ViewSwitcher, querySelector;
    var fixture, authenticatedView, deauthenticatedView, viewSwitcher;

    beforeEach(function() {
      ViewSwitcher = this.iframe.ViewSwitcher;
      querySelector = this.iframe.querySelector;

      fixture = document.createElement('div');
      fixture.innerHTML = '' +
        '<div id="authenticated-view" style="display:none">...UI...</div>' +
        '<div id="deauthenticated-view">...UI...</div>';
      document.body.appendChild(fixture);

      authenticatedView = querySelector('#authenticated-view', fixture);
      deauthenticatedView = querySelector('#deauthenticated-view', fixture);

      var emitter = {};
      MicroEvent.mixin(emitter);

      viewSwitcher = new ViewSwitcher([{
        'emitters': [emitter],
        'eventName': 'authenticated',
        'elementsToShow': [authenticatedView],
        'elementsToHide': [deauthenticatedView]
      }]);

      emitter.trigger('authenticated');
    });

    it('shows and hides the given elements when the given event is emitted by the given element', function() {
      expect(authenticatedView).to.be.visible();
      expect(deauthenticatedView).not.to.be.visible();
      expect(this.app.className).to.contain('authenticated');
    });

    afterEach(function() {
      document.body.removeChild(fixture);
    });

  });

}());
