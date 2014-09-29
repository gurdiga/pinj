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
    this._2coProductIdDOMElement = DOM.querySelector('input[type="hidden"][name="product_id"]');
    this.pinjEmailHiddenInput = DOM.querySelector('input[type="hidden"][name="pinj_email"]');
  };

  PaymentOverdueMessage.prototype.listenForAuthenticatedEventOnUserService = function() {
    this.userService.bind('authenticated', this.loadSubscription.bind(this));
  };

  PaymentOverdueMessage.prototype.listenForEventsOnSubscription = function() {
    this.subscription.bind('changed', this.updateSubscriptionFromId.bind(this));
  };

  PaymentOverdueMessage.prototype.loadSubscription = function(email) {
    this.email = email;

    this.subscription.get()
    .then(function(subscriptionId) {
      if (subscriptionId) this.updateSubscriptionFromId(subscriptionId);
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

  PaymentOverdueMessage.prototype.updateSubscriptionFromId = function(subscriptionId) {
    hide(this.subscriptionDialogButton);
    show(this.paymentButton);

    var subscriptionName = this.getSubscriptionNameById(subscriptionId);
    this.updateSubscriptionName(subscriptionName);
    this._2coProductIdDOMElement.value = getProductIdParamBySubscriptionId(subscriptionId);
    this.pinjEmailHiddenInput.value = this.email;

    this.trigger('updated');
  };

  function getProductIdParamBySubscriptionId(subscriptionId) {
    // Please see https://www.2checkout.com/va/products/ for the corresponding 2CO IDs.
    var _2CO_PRODUCT_ID_BY_SUBSCRIPTION_ID = {
      'c15': 2,
      'c30': 3,
      'c60': 4
    };

    if (!_2CO_PRODUCT_ID_BY_SUBSCRIPTION_ID.hasOwnProperty(subscriptionId)) throw new Error('Bad subscription ID: “' + subscriptionId + '”');

    return _2CO_PRODUCT_ID_BY_SUBSCRIPTION_ID[subscriptionId];
  }

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

  PaymentOverdueMessage.prototype.getProductIdParam = function() {
    return this._2coProductIdDOMElement.value;
  };

  PaymentOverdueMessage.prototype.getPINJEmailParam = function() {
    return this.pinjEmailHiddenInput.value;
  };

  function hide(button) {
    button.style.display = 'none';
  }

  function show(button) {
    button.style.display = 'inline-block';
  }

  window.PaymentOverdueMessage = PaymentOverdueMessage;

}());
