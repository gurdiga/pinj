(function() {
  'use strict';

  describe('Logout button', function() {
    var LogoutButton, Deferred, UserService;
    var logoutButton, domElement, userService;

    beforeEach(function() {
      LogoutButton = this.iframe.LogoutButton;
      Deferred = this.iframe.Deferred;
      UserService = this.iframe.UserService;

      userService = sinon.createStubInstance(UserService);
      MicroEvent.mixin(userService);
      userService.logout.returns(Deferred.createResolvedPromise());

      domElement = document.createElement('button');
      logoutButton = new LogoutButton(domElement, userService);
    });

    it('listens for the “click” events on the given element and calls UserService#logout', function() {
      domElement.click();
      expect(userService.logout).to.have.been.called;
    });
  });

}());
