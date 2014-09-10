(function() {
  'use strict';

  describe('Logout button', function() {
    var LogoutButton, Deferred, UserService;
    var logoutButton, domElement, location;

    beforeEach(function() {
      LogoutButton = this.iframe.LogoutButton;
      Deferred = this.iframe.Deferred;
      UserService = this.iframe.UserService;
      this.sinon.stub(UserService.prototype, 'logout', Deferred.createResolvedPromise);

      domElement = document.createElement('button');
      location = { reload: this.sinon.spy() };
      logoutButton = new LogoutButton(domElement, location);
    });

    it('listens for the “click” events on the given element and calls UserService#logout', function() {
      domElement.click();
      expect(UserService.prototype.logout).to.have.been.called;
    });
  });

}());
