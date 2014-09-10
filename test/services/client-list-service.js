(function() {
  'use strict';

  describe.integration('ClientListService', function() {
    this.timeout(5000);

    var App, Firebase, ClientListService;
    var clientList, list, ref, email, password;

    before(function(done) {
      App = this.iframe.App;
      ClientListService = this.iframe.ClientListService;
      Firebase = this.iframe.Firebase;

      ref = new Firebase(App.FIREBASE_URL);
      list = 'Joe Doe\rJane Doe';

      email = 'firstname.lastname@test.com';
      password = email;

      App.userService.registerUser(email, password)
      .then(function() {
        return App.userService.authenticateUser(email, password)
        .then(function() {
          clientList = new ClientListService(email);
          done();
        });
      })
      .catch(done);
    });

    it('can save a list of clients', function(done) {
      waitForTheSavedValue(function(savedList) {
        expect(savedList).to.equal(list);
        done();
      });

      clientList.save(list)
      .catch(done);

      function waitForTheSavedValue(f) {
        ref.child(clientList.path)
        .once('value', function(snapshot) {
          f(snapshot.val());
        });
      }
    });

    it('can load the saved list', function(done) {
      clientList.load()
      .then(this.bubbleErrors(function(list) {
        expect(list).to.equal(list);
        done();
      }));
    });

    after(function(done) {
      ref.child(clientList.path).remove(this.bubbleErrors(done));
      App.userService.unregisterUser(email, password);
    });
  });

}());
