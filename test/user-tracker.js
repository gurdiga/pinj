(function() {
  'use strict';

  describe('UserTracker', function() {
    var UserTracker, UserService, UserDataService, Firebase, Deferred;
    var userTracker, userService, userDataService;

    beforeEach(function() {
      UserTracker = this.iframe.UserTracker;
      UserService = this.iframe.UserService;
      UserDataService = this.iframe.UserDataService;
      Firebase = this.iframe.Firebase;
      Deferred = this.iframe.Deferred;

      userService = sinon.createStubInstance(UserService);
      MicroEvent.mixin(userService);
      userDataService = sinon.createStubInstance(UserDataService);
      userDataService.set.returns(Deferred.createResolvedPromise());
      userDataService.get.returns(Deferred.createResolvedPromise());

      userTracker = new UserTracker(userService, userDataService);
    });

    it('records user registration and last login timestamps', function(done) {
      userTracker.once('recorded-timestamps', this.bubbleErrors(function() {
        var lastLoginRecordingArgs = userDataService.set.firstCall.args;
        var lastLoginRecordingPath = lastLoginRecordingArgs[0];
        var lastLoginRecordingValue = lastLoginRecordingArgs[1];

        expect(lastLoginRecordingPath).to.equal('timestamps/lastLogin');
        expect(lastLoginRecordingValue).to.equal(Firebase.ServerValue.TIMESTAMP);

        var registrationRecordingArgs = userDataService.set.secondCall.args;
        var registrationRecordingPath = registrationRecordingArgs[0];
        var registrationRecordingValue = registrationRecordingArgs[1];

        expect(registrationRecordingPath).to.equal('timestamps/registration');
        expect(registrationRecordingValue).to.equal(Firebase.ServerValue.TIMESTAMP);

        done();
      }));

      userService.trigger('authenticated');
    });
  });

}());
