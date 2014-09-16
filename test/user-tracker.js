(function() {
  'use strict';

  describe.integration('UserTracker', function() {
    this.timeout(5000);

    var UserTracker, Firebase, App, UserDataService;
    var userTracker, email, password;

    before(function() {
      UserTracker = this.iframe.UserTracker;
      Firebase = this.iframe.Firebase;
      App = this.iframe.App;
      UserDataService = this.iframe.UserDataService;

      email = 'user-tracker@test.com';
      password = 'Passw0rd';

      userTracker = new UserTracker();
    });

    it('records user registration and last login timestamps', function(done) {
      userTracker.once('recorded-registration', function() {
        var userDataService = new UserDataService(email);

        userDataService.get('timestamps/registration')
        .then(function(registrationTimestamp) {
          expect(registrationTimestamp, 'registration timestamp').to.exist;
        })
        .then(function() {
          return userDataService.get('timestamps/lastLogin');
        })
        .then(function(lastLoginTimestamp) {
          expect(lastLoginTimestamp, 'last login timestamp').to.exist;
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
      var userDataService = new UserDataService(email);

      App.userService.unregisterUser(email, password)
      .catch(function(error) {
        console.error('Error on test user unregistration', error);
      });

      userDataService.getRef().child('/data/user-tracker@test:com').remove(function(error) {
        if (error) console.error('Error on data cleanup', error);

        App.userService.logout()
        .then(done)
        .catch(done);
      });
    });
  });

}());
