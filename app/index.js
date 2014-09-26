(function main() {
  'use strict';

  var App = {
    FIREBASE_URL: 'https://pinj-dev.firebaseio.com'
  };

  window.App = App;

  App.userService = new UserService();
  App.userDataService = new UserDataService(App.userService);
  App.userTracker = new UserTracker(App.userService, App.userDataService);
  App.paymentTracker = new PaymentTracker(App.userTracker, App.userDataService);

  var logoutButton = DOM.querySelector('#logout-button');
  new LogoutButton(logoutButton, App.userService);

  var authenticatedView = DOM.querySelector('#authenticated-view');
  var unauthenticatedView = DOM.querySelector('#unauthenticated-view');
  var currentUserEmail = DOM.querySelector('#current-user-email');
  var privateMenu = DOM.querySelector('#private-menu');
  var hamburgerButton = DOM.querySelector('button.navbar-toggle[data-target="#private-menu"]');
  new ViewSwitcher([{
    'eventNames': ['authenticated'],
    'emitters': [App.userService],
    'elementsToShow': [authenticatedView, privateMenu, hamburgerButton, currentUserEmail],
    'elementsToHide': [unauthenticatedView]
  }, {
    'eventNames': ['deauthenticated', 'not-authenticated'],
    'emitters': [App.userService],
    'elementsToShow': [unauthenticatedView],
    'elementsToHide': [authenticatedView, privateMenu, hamburgerButton, currentUserEmail]
  }]);

  var tabLabels = DOM.querySelectorAll('a[data-toggle="tab"]');
  new FirstFieldFocuser(tabLabels);
  new FormValidationResetter(tabLabels);
  new TabPreselector(location.hash);

  new CurrentUserEmailUpdater(App.userService, currentUserEmail);

  var form = DOM.querySelector('#client-list-form');
  new ClientListForm(App.userService, App.userDataService, form);

  App.subscription = new Subscription(App.userDataService);

  var paymentOverdueMessage = DOM.querySelector('#payment-overdue-message');
  new ViewSwitcher([{
    'eventNames': ['payment-overdue'],
    'emitters': [App.paymentTracker],
    'elementsToShow': [paymentOverdueMessage]
  }, {
    'eventNames': ['deauthenticated'],
    'emitters': [App.userService],
    'elementsToHide': [paymentOverdueMessage]
  }]);

  var linkToOpenSubscriptionDialog = DOM.querySelector('#subscription-button');
  var subscriptionDialogDOMElement = DOM.querySelector('#subscription-dialog');
  App.subscriptionDialog = new SubscriptionDialog(subscriptionDialogDOMElement, App.subscription);
  new SubscriptionInquirer(linkToOpenSubscriptionDialog, PaymentTracker.TRIAL_PERIOD, App.userTracker, App.userDataService);
  new PaymentOverdueMessage(paymentOverdueMessage, subscriptionDialogDOMElement, App.userService, App.subscription);

  new ThankYouMessage(location.hash);

  new AuthenticationForm(DOM.querySelector('#authentication-form'), App.userService);
  new RegistrationForm(DOM.querySelector('#registration-form'), App.userService);

}());
