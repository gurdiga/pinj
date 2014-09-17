(function() {
  'use strict';

  describe('Logout button', function() {
    var LogoutButton, Deferred, App;
    var logoutButton, domElement;

    beforeEach(function() {
      LogoutButton = this.iframe.LogoutButton;
      Deferred = this.iframe.Deferred;
      App = this.iframe.App;

      this.sinon.stub(App.userService, 'logout', Deferred.createResolvedPromise);
      domElement = document.createElement('button');
      logoutButton = new LogoutButton(domElement, App.userService);
    });

    it('listens for the “click” events on the given element and calls UserService#logout', function() {
      domElement.click();
      expect(App.userService.logout).to.have.been.called;
    });
  });

}());
