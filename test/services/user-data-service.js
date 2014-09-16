(function() {
  'use strict';

  describe.integration('UserDataService', function() {
    this.timeout(5000);

    var UserDataService, App;
    var userDataService, email, password, aPieceOfData;

    before(function(done) {
      UserDataService = this.iframe.UserDataService;
      App = this.iframe.App;

      email = 'user-data-service@test.com';
      password = 'Passw0rd';
      aPieceOfData = 'some data';
      userDataService = new UserDataService(email);

      App.userService.registerUser(email, password)
      .then(function() {
        return App.userService.authenticateUser(email, password);
      })
      .then(done)
      .catch(done);
    });

    it('can write a pice of data at a given path', function(done) {
      userDataService.set('a/given/path', aPieceOfData)
      .then(done)
      .catch(done);
    });

    it('can read the written piece of data', function(done) {
      userDataService.get('a/given/path')
      .then(this.bubbleErrors(function(data) {
        expect(data).to.equal(aPieceOfData);
        done();
      }))
      .catch(done);
    });

    after(function(done) {
      userDataService.getRef().child('/data/user-data-service@test:com').remove(function(error) {
        if (error) console.error('Error on data cleanup', error);

        App.userService.logout()
        .then(function() {
          return App.userService.unregisterUser(email, password);
        })
        .then(done)
        .catch(done);
      });
    });
  });

}());
