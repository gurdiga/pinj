(function main() {
  'use strict';

  window.testClient = new TestClient(window.parent.testRunner);

  var App = {
    FIREBASE_URL: 'https://pinj-dev.firebaseio.com'
  };

  window.App = App;

  App.userService = new UserService();
  App.userDataService = new UserDataService(App.userService);
  App.userTracker = new UserTracker(App.userService, App.userDataService);
  App.paymentTracker = new PaymentTracker(App.userTracker, App.userDataService);

  new AuthenticationForm(querySelector('#authentication-form'), App.userService);
  new RegistrationForm(querySelector('#registration-form'), App.userService);

  var logoutButton = querySelector('#logout-button');
  new LogoutButton(logoutButton, App.userService);

  var authenticatedView = querySelector('#authenticated-view');
  var unauthenticatedView = querySelector('#unauthenticated-view');
  var currentUserEmail = querySelector('#current-user-email');
  var privateMenu = querySelector('#private-menu');
  var hamburgerButton = querySelector('button.navbar-toggle[data-target="#private-menu"]');
  new ViewSwitcher([{
    'eventName': 'authenticated',
    'emitters': [App.userService],
    'elementsToShow': [authenticatedView, privateMenu, hamburgerButton, currentUserEmail],
    'elementsToHide': [unauthenticatedView]
  }, {
    'eventName': 'deauthenticated',
    'emitters': [App.userService],
    'elementsToShow': [unauthenticatedView],
    'elementsToHide': [authenticatedView, privateMenu, hamburgerButton, currentUserEmail]
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
  new FirstFieldFocuser(tabLabels);

  new TabPreselector(location.hash);

  new CurrentUserEmailUpdater(App.userService, currentUserEmail);

  var form = querySelector('#client-list-form');
  new ClientListForm(App.userService, App.userDataService, form);

  new FormValidationResetter(tabLabels);

  var linkToOpenSubscriptionDialog = querySelector('#subscription-button');
  var subscriptionDialogDOMElement = querySelector('#subscription-dialog');
  var subscriptionDialogSubmitButton = querySelector('button.btn-primary', subscriptionDialogDOMElement);
  new SubscriptionDialog(linkToOpenSubscriptionDialog, subscriptionDialogDOMElement, subscriptionDialogSubmitButton, App.userDataService);

}());
