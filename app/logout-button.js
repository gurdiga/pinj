(function() {
  'use strict';

  function LogoutButton(logoutButton, userService) {
    this.userService = userService;
    this.watchForClicksOn(logoutButton);
  }

  MicroEvent.mixin(LogoutButton);

  LogoutButton.prototype.watchForClicksOn = function(logoutButton) {
    logoutButton.addEventListener('click', function() {
      this.userService.logout();
    }.bind(this));
  };

  window.LogoutButton = LogoutButton;

}());
