(function main() {
  'use strict';

  var App = {
    FIREBASE_URL: 'https://pinj-dev.firebaseio.com'
  };

  window.App = App;

  MicroEvent.mixin(document.body);

  var logoutButton = querySelector('#logout-button');
  new LogoutButton(logoutButton, window.location);

  var tabLabels = jQuery('a[data-toggle="tab"]');
  new InputFocuser(tabLabels);

  new TabPreselector(location.hash);

  App.userService = new UserService();
  new UserTracker();

  var authenticatedView = querySelector('#authenticated-view');
  var unauthenticatedView = querySelector('#unauthenticated-view');
  var currentUserEmail = querySelector('#current-user-email');
  new ViewSwitcher([{
    'eventName': 'authenticated',
    'emitters': [App.userService],
    'elementsToShow': [authenticatedView, logoutButton, currentUserEmail],
    'elementsToHide': [unauthenticatedView]
  }, {
    'eventName': 'deauthenticated',
    'emitters': [App.userService],
    'elementsToShow': [unauthenticatedView],
    'elementsToHide': [authenticatedView, logoutButton, currentUserEmail]
  }]);

  new EmailUpdater(App.userService, currentUserEmail);

  App.userService.bind('authenticated', function(email) {
    var clientListService = new ClientListService(email);
    var form = querySelector('#client-list-form');
    var saveConfirmationMessage = querySelector('#save-confirmation-message', form);
    new ClientListForm(clientListService, form['list'], form['submit-button'], saveConfirmationMessage);
  });

  new AuthenticationForm(querySelector('#authentication-form'));
  new RegistrationForm(querySelector('#registration-form'));

  setTimeout(function() {
    document.body.trigger('ready-for-tests');
  }, 500);

}());
