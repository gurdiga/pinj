(function main() {
  'use strict';

  var App = {
    FIREBASE_URL: 'https://pinj-dev.firebaseio.com'
  };

  window.App = App;

  App.userService = new UserService();
  App.userDataService = new UserDataService(App.userService);
  App.paymentTracker = new PaymentTracker(App.userService, App.userDataService);

  new UserTracker(App.userService, App.userDataService);

  new AuthenticationForm(querySelector('#authentication-form'), App.userService);
  new RegistrationForm(querySelector('#registration-form'), App.userService);

  var logoutButton = querySelector('#logout-button');
  new LogoutButton(logoutButton, App.userService);

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

  var paymentOverdueMessage = querySelector('#payment-overdue-message');
  new ViewSwitcher([{
    'eventName': 'payment-overdue',
    'emitters': [App.paymentTracker],
    'elementsToShow': [paymentOverdueMessage]
  }, {
    'eventName': 'deauthenticated',
    'emitters': [App.userService],
    'elementsToHide': [paymentOverdueMessage]
  }]);

  var tabLabels = jQuery('a[data-toggle="tab"]');
  new InputFocuser(tabLabels);

  new TabPreselector(location.hash);

  new CurrentUserEmailUpdater(App.userService, currentUserEmail);

  var form = querySelector('#client-list-form');
  new ClientListForm(App.userService, App.userDataService, form);

  MicroEvent.mixin(document.body);

  setTimeout(function() {
    document.body.trigger('ready-for-tests');
  }, 500);

}());
