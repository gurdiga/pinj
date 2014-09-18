(function() {
  'use strict';

  describe.integration('UserTracker', function() {
    var UserTracker, App;
    var userTracker, email, password;

    before(function() {
      UserTracker = this.iframe.UserTracker;
      App = this.iframe.App;

      email = 'user-tracker@test.com';
      password = 'Passw0rd';
      userTracker = new UserTracker(App.userService, App.userDataService);
    });

    it('records user registration and last login timestamps', function(done) {
      this.timeout(10000);

      userTracker.once('recorded-registration', function() {
        App.userDataService.get('timestamps/registration')
        .then(function(registrationTimestamp) {
          expect(registrationTimestamp, 'registration timestamp').to.be.a('number');
        })
        .then(function() {
          return App.userDataService.get('timestamps/lastLogin');
        })
        .then(function(lastLoginTimestamp) {
          expect(lastLoginTimestamp, 'last login timestamp').to.be.a('number');
        })
        .then(done)
        .catch(done);
      });

      App.userService.registerUser(email, password)
      .then(function() {
        return App.userService.authenticateUser(email, password);
      })
      .catch(done);
    });

    after(function(done) {
      this.timeout(10000);

      App.userDataService.set('/', null)
      .then(function() {
        return App.userService.logout();
      })
      .then(function() {
        return App.userService.unregisterUser(email, password);
      })
      .then(done)
      .catch(done);
    });
  });

}());
