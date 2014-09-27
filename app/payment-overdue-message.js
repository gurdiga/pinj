(function() {
  'use strict';

  function PaymentOverdueMessage(messageDOMElement, subscriptionDialogDOMElement, userService, subscription) {
    this.messageDOMElement = messageDOMElement;
    this.subscriptionDialogDOMElement = subscriptionDialogDOMElement;
    this.userService = userService;
    this.subscription = subscription;

    this.findRelevantDomElements();

    this.listenForAuthenticatedEventOnUserService();
    this.listenForEventsOnSubscription();
  }

  PaymentOverdueMessage.SUBSCRIPTION_NAME_DOM_ID = 'subscription-name';
  PaymentOverdueMessage.SUBSCRIPTION_DIALOG_BUTTON_DOM_ID = 'subscription-dialog-button';
  PaymentOverdueMessage.PAYMENT_BUTTON_DOM_ID = 'payment-button';

  MicroEvent.mixin(PaymentOverdueMessage);

  PaymentOverdueMessage.prototype.findRelevantDomElements = function() {
    this.subscriptionNameDOMElement = DOM.querySelector('#' + PaymentOverdueMessage.SUBSCRIPTION_NAME_DOM_ID, this.messageDOMElement);
    this.subscriptionDialogButton = DOM.querySelector('#' + PaymentOverdueMessage.SUBSCRIPTION_DIALOG_BUTTON_DOM_ID, this.messageDOMElement);
    this.paymentButton = DOM.querySelector('#' + PaymentOverdueMessage.PAYMENT_BUTTON_DOM_ID, this.messageDOMElement);
  };

  PaymentOverdueMessage.prototype.listenForAuthenticatedEventOnUserService = function() {
    this.userService.bind('authenticated', this.loadSubscription.bind(this));
  };

  PaymentOverdueMessage.prototype.listenForEventsOnSubscription = function() {
    this.subscription.bind('changed', this.updateSubscriptionNameFromId.bind(this));
  };

  PaymentOverdueMessage.prototype.loadSubscription = function() {
    this.subscription.get()
    .then(function(subscriptionId) {
      if (subscriptionId) this.updateSubscriptionNameFromId(subscriptionId);
      else this.showSubscriptionDialogButton();
    }.bind(this))
    .catch(function(error) {
      console.error('Error when loading the subscription', error);
    });
  };

  PaymentOverdueMessage.prototype.showSubscriptionDialogButton = function() {
    show(this.subscriptionDialogButton);
    hide(this.paymentButton);

    this.trigger('subscription-dialog-button-shown');
  };

  PaymentOverdueMessage.prototype.getSubscriptionDialogButton = function() {
    return this.subscriptionDialogButton;
  };

  PaymentOverdueMessage.prototype.getPaymentButton = function() {
    return this.paymentButton;
  };

  PaymentOverdueMessage.prototype.updateSubscriptionNameFromId = function(subscriptionId) {
    hide(this.subscriptionDialogButton);
    show(this.paymentButton);

    var subscriptionName = this.getSubscriptionNameById(subscriptionId);
    this.updateSubscriptionName(subscriptionName);

    this.trigger('updated');
  };

  PaymentOverdueMessage.prototype.getSubscriptionNameById = function(subscriptionId) {
    var subscriptionDOMElement = DOM.querySelector('input[type="radio"][name="subscription"][value="' + subscriptionId + '"]', this.subscriptionDialogDOMElement);
    var subscriptionName = subscriptionDOMElement.parentNode.textContent;
    return subscriptionName;
  };

  PaymentOverdueMessage.prototype.updateSubscriptionName = function(subscriptionName) {
    this.subscriptionNameDOMElement.textContent = subscriptionName;
  };

  PaymentOverdueMessage.prototype.getSubscriptionName = function() {
    return this.subscriptionNameDOMElement.textContent;
  };

  PaymentOverdueMessage.prototype.getSubscriptionNameDOMElement = function() {
    return this.subscriptionNameDOMElement;
  };

  function hide(button) {
    button.style.display = 'none';
  }

  function show(button) {
    button.style.display = 'inline-block';
  }

  window.PaymentOverdueMessage = PaymentOverdueMessage;

}());
