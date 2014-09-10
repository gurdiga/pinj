(function() {
  'use strict';

  function LogoutButton(logoutButton, location) {
    assert(typeof location.reload === 'function', 'LogoutButton: the second argument must have a reload() function');

    this.location = location || window.location;
    this.watchForClicksOn(logoutButton);
  }

  MicroEvent.mixin(LogoutButton);

  LogoutButton.prototype.watchForClicksOn = function(logoutButton) {
    logoutButton.addEventListener('click', function() {
      App.userService.logout();
    });
  };

  window.LogoutButton = LogoutButton;

}());
