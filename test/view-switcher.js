(function() {
  'use strict';

  describe('View switcher', function() {
    var ViewSwitcher, DOM;
    var fixture, authenticatedView, deauthenticatedView, viewSwitcher, emitter;

    beforeEach(function() {
      ViewSwitcher = this.iframe.ViewSwitcher;
      DOM = this.iframe.DOM;

      fixture = document.createElement('div');
      fixture.innerHTML = '' +
        '<div id="authenticated-view" style="display:none">...UI...</div>' +
        '<div id="deauthenticated-view">...UI...</div>';
      document.body.appendChild(fixture);

      authenticatedView = DOM.querySelector('#authenticated-view', fixture);
      deauthenticatedView = DOM.querySelector('#deauthenticated-view', fixture);

      emitter = {};
      MicroEvent.mixin(emitter);
    });

    it('shows and hides the given elements when the given event is emitted by the given element', function() {
      viewSwitcher = new ViewSwitcher([{
        'emitters': [emitter],
        'eventNames': ['authenticated'],
        'elementsToShow': [authenticatedView],
        'elementsToHide': [deauthenticatedView]
      }]);

      emitter.trigger('authenticated');

      expect(authenticatedView).to.be.visible();
      expect(deauthenticatedView).not.to.be.visible();
      expect(this.app.className).to.contain('authenticated');
    });

    it('accepts missing elementsToHide/elementsToShow', function() {
      viewSwitcher = new ViewSwitcher([{
        'emitters': [emitter],
        'eventNames': ['authenticated'],
        'elementsToHide': [deauthenticatedView]
      }]);

      emitter.trigger('authenticated');

      expect(deauthenticatedView).not.to.be.visible();
    });

    afterEach(function() {
      document.body.removeChild(fixture);
    });

  });

}());
