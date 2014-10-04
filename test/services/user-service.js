(function() {
  'use strict';

  describe.integration('UserService', function() {
    this.timeout(5000);

    var App, UserService, Firebase, Deferred, UserDataService;
    var userService, email, password, ref;

    before(function() {
      App = this.iframe.App;
      UserService = this.iframe.UserService;
      Firebase = this.iframe.Firebase;
      Deferred = this.iframe.Deferred;
      UserDataService = this.iframe.UserDataService;

      userService = new UserService();
      ref = new Firebase(App.FIREBASE_URL);

      email = 'user-service@test.com';
      password = 'Passw0rd';
    });

    describe('registerUser(email, password)', function() {
      it('creates an user account with the given email and password', function(done) {
        userService.registerUser(email, password)
        .catch(done)
        .then(checkCanAuthenticate(email, password))
        .then(done);
      });
    });

    describe('authenticateUser(email, password)', function() {
      it('authenticates a registered with the given email and password and emits the “authenticated” event', function(done) {
        var emittedTheEvent = false;

        userService.once('authenticated', function() {
          emittedTheEvent = true;
        });

        userService.authenticateUser(email, password)
        .then(function() {
          expect(emittedTheEvent).to.be.true;

          var cookie = getFirebaseCookie();
          expect(cookie, 'cookie').to.exist;
          expect(cookie.password.email, 'cookie email').to.eq(email);

          done();
        })
        .catch(done);
      });

      describe('when authenticating for the first time', function() {
        it('stores UID in user’s profile', function(done) {
          var isFirstTime = true;

          userService.authenticateUser(email, password, isFirstTime)
          .then(function() {
            var uidPath = UserService.getUIDPathForEmail(email);

            ref.child(uidPath).once('value',
            function successCallback(snapshot) {
              expect(snapshot.val()).to.exist;
              done();
            },
            function cancelCallback(error) {
              done(error);
            });
          })
          .catch(done);
        });

        after(removeProfile);

        function removeProfile(done) {
          ref.child(UserDataService.getDataRootForEmail(email))
          .remove(function(error) {
            if (error) done(error);
            else done();
          });
        }
      });
    });

    describe('tryRestoreSession()', function() {
      var session;

      describe('when a user session is found', function() {
        beforeEach(function() {
          session = { password: { email: 'test@test.com' } };
        });

        it('emits “authenticated” event on the instance with the found user’s email', function(done) {
          userService.once('authenticated', function(email) {
            expect(email).to.equal(session.password.email);
            done();
          });

          userService.tryRestoreSession(session);
        });
      });

      describe('when no session is found', function() {
        beforeEach(function() {
          session = null;
        });

        it('if no user session found emits “not-authenticated” event on the instance', function(done) {
          userService.once('not-authenticated', done);
          userService.tryRestoreSession(session);
        });
      });
    });

    describe('logout()', function() {
      it('ends the current user session and emits the “deauthenticated” event', function(done) {
        var emittedTheEvent = false;

        userService.bind('deauthenticated', function() {
          emittedTheEvent = true;
        });

        userService.logout()
        .then(function() {
          expect(emittedTheEvent).to.be.true;
          done();
        })
        .catch(done);
      });
    });

    describe('unregisterUser(email, password)', function() {
      it('unregisters a user identified by the given email and password', function(done) {
        userService.unregisterUser(email, password)
        .catch(done)
        .then(checkCanAuthenticate(email, password))
        .then(function() {
          done(new Error('Authentication should have failed after deregistration'));
        })
        .catch(function(error) {
          if (error.code === 'INVALID_USER') done();
          else done(error);
        });
      });
    });

    after(unregisterUserIfLeft);

    function unregisterUserIfLeft(done) {
      ref.removeUser({
        'email': email,
        'password': password
      }, function(error) {
        if (error === null) done(new Error('UserService.unregisterUser() should have removed the account'));
        if (error.code === 'INVALID_USER') done();
        ref.unauth();
        done(error);
      });
    }

    function checkCanAuthenticate(email, password) {
      return function() {
        var deferred = new Deferred();

        ref.authWithPassword({
          'email': email,
          'password': password
        }, function(error, user) {
          if (error) deferred.reject(error);
          else if (user) deferred.resolve();
        });

        return deferred.promise;
      };
    }

    function getFirebaseCookie() {
      var cookieName = 'firebase:session::pinj-dev';

      if (!localStorage[cookieName]) return {};

      try {
        return JSON.parse(localStorage[cookieName]);
      } catch(e) {
        return {};
      }
    }
  });

}());
