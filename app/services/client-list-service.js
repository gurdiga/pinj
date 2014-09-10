(function() {
  'use strict';

  function ClientListService(email) {
    this.ref = new Firebase(App.FIREBASE_URL);

    var aid = email.replace(/\./g, ':');
    this.path = '/data/' + aid + '/clients';
  }

  ClientListService.prototype.load = function() {
    var deferred = new Deferred();

    this.ref.child(this.path)
    .once('value', function(snapshot) {
      deferred.resolve(snapshot.val());
    });

    return deferred.promise;
  };

  ClientListService.prototype.save = function(newList) {
    var deferred = new Deferred();

    this.ref.child(this.path)
    .set(newList, function(error) {
      if (error) deferred.reject(error);
      else deferred.resolve();
    });

    return deferred.promise;
  };

  window.ClientListService = ClientListService;

}());
